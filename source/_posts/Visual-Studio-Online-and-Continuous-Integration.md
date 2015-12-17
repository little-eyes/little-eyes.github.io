title: "Visual Studio Online and Continuous Integration"
layout: post
tags:
- infrastructure
- azure
- Visual Studio Online
- Continuous Integration
category:
- technology
date: 2015/12/16
---

In the [previous blog][0], we talked about `Continuous Integration` from Azure's perspective. However, those functionalities is not as powerful as another mature platform **[Visual Studio Online][1]** (VSO). VSO provides a standard source code management and build workflow.

The way Visual Studio Online setup the continuous integration has the exactly reverse thought from Azure. Instead of pulling code from VSO inside Azure, then build and deploy, VSO will continuously build your code whenever you check in. Once the bits are generated, VSO will deploy to Azure or any other container directly with the bits. Eventually, you manage your continuous integration workflow inside VSO and Azure is just one container.

<!-- more -->

Personally, I would like to choose the second approach for a couple of reasons. First of all, VSO has a standard build environment for pretty much any platform such as iOS and Android. We used to think Visual Studio is a tool only work for Windows, but the modern Visual Studio Online is beast that works with any platform. The build system is not only msbuild, but including other open source framework like **[GruntJS][2]** as well. Secondly, you can extend the whole workflow easily by adding new steps such as batch process, shell script, Android signing etc. Those are really cool features to automate your whole integration. For example, you are building an app, then you can add the Android signing before you release your bits. It's automatically done whenever you merge your code from develop to release branch. Thirdly, it has a great integration with deployment to Azure cloud and other environment. If one day you want to change your cloud services vendor, this continuous integration will still work as it is.

![Alt text](/images/environment.png)
![Alt text](/images/task.png)

In a normal release workflow, you probably want to use Git to setup two or three different branches mapping to `develop`, `pre-production` and `production` stage. Each of this stage will be hooked up with the continuous integration from the corresponding Git branch. Therefore, the release workflow becomes a simple Git merge process.

In terms of the many features that VSO has now, it could become a good choice to be the engineering platform for your next project. On the other hand, I feel like all the cloud platforms are becoming a graph which one can hook up with another. It certainly becomes harder to make a decision to choose one as your engineering platform. Hopefully Visual Studio Online could become one of the hub that connect all other platforms and provides easier access to engineers.

[0]: /2015/11/21/PaaS-And-Continuous-Integration/
[1]: https://www.visualstudio.com
[2]: http://gruntjs.com/