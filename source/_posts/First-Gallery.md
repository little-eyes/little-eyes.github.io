title: "First Gallery - Azure CDN"
layout: post
tags:
  - photography
  - azure
  - cdn
category:
  - photography
date: 2015/9/22
---

{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07801.JPG %}

<!--![Alt text][19]-->

Recently, my friend and I were discussing about the power of Azure's CDN (or AWS's CDN) and how do we use it. This specific blog is a live demo to use Azure CDN power up my personal gallery. The reason I need to use a CDN is simple: I cannot check in all the pictures to my Github repository. So we need to find an alternative solution. To explore how to use Azure's CDN, I would strongly suggest you read the official document [Using CDN for Azure][1]. Usually, after you setup your storage blob on Azure, you can use [Azure Storage Explorer][2] to upload your content very easily.

Thereafter, in your markdown file, it is very easy to refer to your Azure CDN for your pictures or stream videos. An example is the following:

```{markdown}
![Alt text](https://jilongliao.blob.core.windows.net/blog-image/DSC07271.JPG)
```

Besides, the performance is great: 50ms loading time for a 5MB picture on average.

<!-- more -->

Now it is all setup and time to show some pictures in Seattle.

Night skyline of Seattle
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07271.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07285.JPG %}

Waterfront in Seattle
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05568.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05573.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05574.JPG %}

Bellevue Life
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05636.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07830.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07859.JPG %}

Leavenworth - A German town
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC03953.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC03959-1.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC03993-1.JPG %}

Skagit Tulip
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05709.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC05689.JPG %}

Sunset near Seattle
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07242.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07594.JPG %}
{% fullimage https://jilongliao.blob.core.windows.net/blog-image/DSC07679.JPG %}

[1]: https://azure.microsoft.com/en-us/documentation/articles/cdn-how-to-use-cdn/
[2]: https://azurestorageexplorer.codeplex.com/
