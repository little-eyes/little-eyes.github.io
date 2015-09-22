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
![Alt text][19]

Recently, my friend and I were discussing about the power of Azure's CDN (or AWS's CDN) and how do we use it. This specific blog is a live demo to use Azure CDN power up my personal gallery. The reason I need to use a CDN is simple: I cannot check in all the pictures to my Github repository. So we need to find an alternative solution. To explore how to use Azure's CDN, I would strongly suggest you read the official document [Using CDN for Azure][1]. Usually, after you setup your storage blob on Azure, you can use [Azure Storage Explorer][2] to upload your content very easily.

Thereafter, in your markdown file, it is very easy to refer to your Azure CDN for your pictures or stream videos. An example is the following:

```{markdown}
![Alt text](https://jilongliao.blob.core.windows.net/blog-image/DSC07271.JPG)
```

Besides, the performance is great: 50ms loading time for a 5MB picture on average.

<!-- more -->

Now it is all setup and time to show some pictures in Seattle.

Night skyline of Seattle
![Alt text][3]
![Alt text][10]

Waterfront in Seattle
![Alt text][4]
![Alt text][5]
![Alt text][6]

Bellevue Life
![Alt text][7]
![Alt text][8]
![Alt text][9]

Leavenworth - A German town
![Alt text][11]
![Alt text][12]
![Alt text][13]

Skagit Tulip
![Alt text][14]
![Alt text][15]

Sunset near Seattle
![Alt text][16]
![Alt text][17]
![Alt text][18]

[1]: https://azure.microsoft.com/en-us/documentation/articles/cdn-how-to-use-cdn/
[2]: https://azurestorageexplorer.codeplex.com/
[3]: https://jilongliao.blob.core.windows.net/blog-image/DSC07271.JPG
[4]: https://jilongliao.blob.core.windows.net/blog-image/DSC05568.JPG
[5]: https://jilongliao.blob.core.windows.net/blog-image/DSC05573.JPG
[6]: https://jilongliao.blob.core.windows.net/blog-image/DSC05574.JPG
[7]: https://jilongliao.blob.core.windows.net/blog-image/DSC05636.JPG
[8]: https://jilongliao.blob.core.windows.net/blog-image/DSC07830.JPG
[9]: https://jilongliao.blob.core.windows.net/blog-image/DSC07859.JPG
[10]: https://jilongliao.blob.core.windows.net/blog-image/DSC07285.JPG
[11]: https://jilongliao.blob.core.windows.net/blog-image/DSC03953.JPG
[12]: https://jilongliao.blob.core.windows.net/blog-image/DSC03959-1.JPG
[13]: https://jilongliao.blob.core.windows.net/blog-image/DSC03993-1.JPG
[14]: https://jilongliao.blob.core.windows.net/blog-image/DSC05709.JPG
[15]: https://jilongliao.blob.core.windows.net/blog-image/DSC05689.JPG
[16]: https://jilongliao.blob.core.windows.net/blog-image/DSC07242.JPG
[17]: https://jilongliao.blob.core.windows.net/blog-image/DSC07594.JPG
[18]: https://jilongliao.blob.core.windows.net/blog-image/DSC07679.JPG
[19]: https://jilongliao.blob.core.windows.net/blog-image/DSC07801.JPG
