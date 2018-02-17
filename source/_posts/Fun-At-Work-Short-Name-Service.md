title: "Fun at Work: Short Name Service"
layout: post
tags:
- DocumentDB
category:
- technology
date: 2018/2/16
---

My team at work runs an online service that a user can query their data from multiple dimension values. For exmaple, the user wants to see a data visualization based on `Dimension1=A`, `Dimension2=B` and so on. We used to have a fixed 10 to 20 dimensions so we put them in the URL hash when the user come to the page to visualize their data. 

Usually, you will see a URL like this: `https://myservice.com/myview#dimension1=A&dimension2=B&dimension3=C`. But the situation changed when we introduced a dynamic/custom dimensions into our system. In other words, the user can specify their own dimensions and values, and we will visualize them. Immediately we see a problem that the URL hash system is out of control because the custom dimensions and values could be anything (including URL not compatible characters) and the URL could easily get too long.

Since we cannot get rid of the URL hash due to the need of showing the same view when copy-and-paste URL, we choose a way to short the URL hash like this: `https://myservice.com/myview#dimensionSet=7syf4uUJhSD5TsMjrAWh63w93s1rgrmNvWJxEpWjq1XT`. The `dimensionSet` is not human readable but it is parsable within the system. Therefore, we can still showing the same view when we copy-and-paste the URL.

Multiple solutions are here but we considered the follow two options for performance, URL length, and storage perspectives.

### Option 1

The basic idea of option 1 is to use hashing algorithms. For each URL hash, it is equivalent to an JSON object (let's call it `original`). So if we do a `MD5(original)`, we actually map the object to a 128-byte space. The MD5 value is the key of the table and value is the original JSON object. Though MD5 is not cryptographically secure, we just need a digest of the original object to be a key. The probability of collision exists, but in our service's scenario, the probability is very low. To be URL compatible, we can use a [base-58 encoding][1] like bitcoin addresses or IPFS hashes. So the final key for the original object is `Base58(MD5(original))`.

NoSQL based database is a perfect fit for high performant and scalable read/write. We use [Azure Document DB][2] to power up our storage for this service. Due to the dimension values are sliding and changing, we can avoid storage over use by setting a TTL for each key-value pair. Good news is Azure Document DB supports it natively by adding a `_ttl` field in the document. An example document model is defined below.

```csharp
// Include a property that serializes to "ttl" in JSON
public class ShortNameDocument
{
    [JsonProperty(PropertyName = "id")]
    public string Id { get; set; }

    [JsonProperty(PropertyName="value")]
    public JToken Value { get; set; }

    // used to set expiration policy
    [JsonProperty(PropertyName = "ttl", NullValueHandling = NullValueHandling.Ignore)]
    public int? TimeToLive { get; set; }
}
```

### Option 2

Option 2 takes the first idea further by restricting the length of the short name to be 6-character such that the URL looks like this: `https://myservice.com/myview#dimensionSet=7sUf4Z`. At certain scenarios such as [bit.ly][3] you will need it. So using a 128-byte MD5 string is much longer than 6-character. We have to consider something else. A base-10 long integer is a good candidate for this. If we take 


[1]: https://en.wikipedia.org/wiki/Base58
[2]: https://azure.microsoft.com/en-us/services/cosmos-db/?v=17.45b
[3]: https://bitly.com/