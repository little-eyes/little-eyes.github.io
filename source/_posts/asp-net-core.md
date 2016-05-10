title: "ASP.NET Core or Not?"
layout: post
tags:
- web stack
category:
- technology
date: 2016/5/10
---

My most recent work led me to an interesting technology stack `ASP.NET Core`, a newer, leaner and agiler version of `ASP.NET`. After two days immersion into this new stack, I kind of feel interested in this technology.

## More than just cross-platform

Of course, we have other language based web stacks like Django for Python, Express in Node.js, Jekyll for Ruby etc. From the new ASP.NET Core, I feel like it's more than just cross-platform. The most obvious thing you may realize once you start playing with it is that ASP.NET Core uses other technologies as well -- `bower`, `npm`. I first do not understand why bother use these two things, but later I find the power of Grunt and Gulp. So it makes sense to reduce the overhead from ASP.NET, but embrace the popular community tool set. Therefore, it opens the door for multi technology within ASP.NET Core [\[1\]][1].

<!-- more -->

To begin development with ASP.NET, you will surprisingly find Visual Studio is not the only way to start your project. Another popular community tool -- `Yeoman` [\[2\]][2] can be used to create a ASP.NET Core project. No more `csproj` file exists, instead, you will see `project.json`. Therefore, a more lightweight and agile Visual Studio Code can be fully used during your development from edit to debug. 

Just simply run a build command to build the project, or you can write a tasks.json for Visual Studio Code, then trigger build through `Ctrl-Shift-B`. We could save a lot of time to research and understand the complex commandline system in `msbuild`, such as `/p:Configuration`, `/p:DeployOnBuild`, `/p:BuildAsSinglePackage`, etc.

```shell
$ dnu.exe build .
```

Obviously you can run your project in other OS as well like a Mac. The platform management system is pretty decent as well. `DNX` [\[3\]][3] has a very good and easy to use version management system `DNVM`, so a few simple command can help you upgrade and downgrade your environment. From this point, I also see how `Docker` [\[4\]][4] will play in a typical development process. We used to have struggles with a complicated dev environment, especially at enterprise level. So a simple docker image could quick create and destroy certain environment and you could also development under a production config container as well.

```shell
$ dnvm upgrade -r coreclr
```

### Separation of Static and Dynamic

Unlike the structure of ASP.NET 4.6, this new toy has a new convention that everything under `wwwroot` will be hosted as static files. This includes Javascript, CSS, JSON, etc. If you use Typescript, the default compiled Javascript will be in the wwwroot directory. Other things MVC parts will organized as usual -- Controllers, Models, Views, ViewModels, etc.

![Alt text](/images/dnx-project.png)

### Multiple Configurations

We always face the multiple configurations for our application. In ASP.NET Core, `Web.Config` is not the center of the dynamic configuration, but a `appsettings.json` file. The re-architect of the configuration can also bring `appsettings.{env.EnvrionmentName}.json` to adapt the app itself to many different application.

### Nuget Package

Looks like everything the ASP.NET Core app depends on are in the form of a Nuget Package. However, `package.json` will not be used any more, replaced by `project.json`. A `dependency` blob is there for adding more Nuget Packages. In ASP.NET 4.6, the Nuget packages are installed in the same level as solution, but in ASP.NET Core has a global place to store all the packages. The `project.lock.json` file is used to finalize the necessary package. However, no need to copy packages even if you have more than one solution. It's all shared.

![Alt text](/images/project-json.png)

In summary, I like the concept that ASP.NET Core provides here to make application lean. It also helps us to re-think our application architecture. Maybe we need to break down our giant applications into multiple `micro services` [\[4\]][4] that each can benefit from the simpleness and performance of this new stack or other equivalences.


[1]: http://docs.asp.net/en/latest/getting-started/index.html
[2]: http://yeoman.io/
[3]: http://docs.asp.net/en/latest/dnx/overview.html
[4]: https://www.docker.com/
[4]: http://martinfowler.com/articles/microservices.html