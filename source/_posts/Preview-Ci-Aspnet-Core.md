title: "Engineering System: Feature Preview for Services"
layout: post
tags:
- infrastructure
- asp.net core
category:
- technology
date: 2017/3/26
---

Another recent challenge at work is to provide a easy-to-use feature preview system for our service layer. Simialr to the work we did in [[1][1]], we plan to provide developers a unique experience with their engineering system Git and automate the whole process as much as possible.

# What is our problem here?

Our team is running a service that more than 15 developers are partying in the service everyday. Each developer is working on some features (both frontend and service layer). We all wants to publish our work somewhere temporaily for 1) demonstration in the UX side for bugbash, design discussion and proof of concept etc. 2) provide service dependency or testing for other developers (this usually happens in the service layer). So we need an awesome system to streamline our day-to-day job. In [[1][1]], we have tactiled the 1) very well in the UX side, so this article is for the second part of the story.

<!-- more -->

# Simple solution - why it works and why it does not.

One simple idea is to give each developer an Azure App Service instance, so that they can deploy their service layer change from localhost. Honesly, this approach works just fine. We adopted this approach when we were delivering a big feature, but the problems come to more and more developers want to party in this approach so it's not scalable. Now you have to replicate all the app settings (more than 10) from instance to another, and coordinate people when they try to use the same test instance. If you have OAuth authentication, you will have to keep adding new host URLs to your allowlist for users to be authenticated. It brings a lot of overhead to us. So we have to come up with a better solution.

# ASP.NET Core and IIS

We started to adopt `.Net Core` since the beginning of our service layer, therefore we take some time to deeply understand how ASP.Net Core and IIS works together. One big question for us is to understand the possiblities and limitations of the multiple ASP.Net Core application running on the same Azure App Service.

The answer is `possible` and it just works. The virtual application concept still works fine for ASP.NET Core. In the picture below, we see a virtual application running at `https://projectx.net/alice:80` will be mapped to a ASP.NET Core application running at port `26243`. If you have another virtual application running at `https://projectx.net/bob:80`, the mapped ASP.NET Core application will be running at port `21537`. At the application layer, we do not even need to worry about the mapping because it happens seamlessly inside IIS.

![](/images/concept.png)

Therefore, our preview system idea is that any developer can push their work to `preview/[alias]/[feature]` branch in Git, and every git push will be continuously integrated into a virtual application running in Azure App Service at `https://projectx.net/[alias]` via Visual Studio Online. Underneath of this virtual application is actually a ASP.NET Core application running at a random port.

# Actions

In every ASP.NET Core project, we can add a `web.config` file to tell IIS what it should do to deal with the ASP.NET Core application. A typical file structure in the Azure App Service is the following.

```shell
wwwroot
    +-- alice/
        +-- ...
        +-- web.config
    +-- bob/
        +-- ...
        +-- web.config
    +-- web.config
```

As we can see, each virtual application will be deployed to its own folder and each one should have a `web.config` file. There is also a root level `web.config` file. At the individual level, a web.config should be like the following.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <aspNetCore processPath=".\MissionControlAPI.Host.exe" arguments="" stdoutLogEnabled="true" stdoutLogFile=".\logs\stdout" forwardWindowsAuthToken="false" />
  </system.webServer>
</configuration>
```

At the root level, the web.config should specify where to find the ASP.NET Core application and launch it. For example, for `Alice`, we need to tell IIS the application is at `/alice`.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="aspNetCore_alice" path="alice/*" verb="*" modules="AspNetCoreModule" resourceType="Unspecified" />
      <add name="aspNetCore_bob" path="bob/*" verb="*" modules="AspNetCoreModule" resourceType="Unspecified" />
      <add name="aspNetCore_david" path="david/*" verb="*" modules="AspNetCoreModule" resourceType="Unspecified" />
    </handlers>
  </system.webServer>
```

In the Azure App Service's app settings, we will need to tell the service that there is a virutal application running at certain location and the name of the virtual application like the following picture. Otherwise, the continuous integration system will get errors when deploying using `MSDeploy`.

![](/images/virtualdirectory.png)

# Feature Preview from UX to Service End-to-end

To think a little bit further more, we will encounter into the situations that we need both our UX and service layer being in the preview system so that to demo something that could end-to-end. There are multiple ways to do this, for instance, you can always change the UX configuration to point to certain service layer and commit your change, and the same thing could be done in the service layer.

Instead, I am thinking of more standard and generic way. One idea come to my mind is to manipulate the Git branch name. For example, we could ask the user to use `preview/alice/svc:david` as the branch name for the UX side, and `preview/david/db:test` for service side. In this example, when CI to deploy the commit, they will automatically transform the configuration to the correct preview service from UX, while the service will point to the correct database if necessary.

Another idea is to allow each developer have a special transformation of their configuration files. For example, a developer could have a `web.alice.config` or `web.bob.config`, then the developer can change anything he wants in the configuration file. The CI will transform the `web.config` based one the branch name and the correct specialized `web.[alias].config` file. This approach will bring more flexibility for the developers but also difficulties to manage and maintain things.


[1]: http://jilongliao.com/2016/02/04/Preview-Ci/