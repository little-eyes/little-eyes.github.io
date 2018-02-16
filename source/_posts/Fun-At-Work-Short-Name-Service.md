title: "Fun at Work: Short Name Service"
layout: post
tags:
- DocumentDB
category:
- technology
date: 2018/2/16
---

My team at work runs an online service that a user can query their data from multiple dimension values. For exmaple, the user wants to see a data visualization based on `Dimension1=A`, `Dimension2=B` and so on. We used to have a fixed 10 to 20 dimensions so we put them in the URL hash when the user come to the page to visualize their data. 

Usually, you will see a URL like this: `https://myservice.com/myview#dimension1=A&dimension2=B&dimension3=C`. But the situation changed when we introduced a dynamic/custom dimensions into our system. In other words, the user can specify their own dimensions and values, and we will visualize them. Immediately it 