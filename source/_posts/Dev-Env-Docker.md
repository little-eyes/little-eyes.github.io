title: "Beyond Dev Environment Setup - Docker"
layout: post
tags:
- Docker
- Infrastructure
category:
- technology
date: 2017/6/24
---

Many of us may have encountered into the situation of configuring your development environment, especially if you work on something at enterprise level. `Environment variables`, `service configurations` such as IIS, `shell enviornment` setup, `certificates` and `passwords` or `secrets` are very common settings for an enterprise project. Whenever a person join the team, there is always a headache to setup everything he/she needs to begin working. Documentation is one of the common ways to write down the instructions. However, we all encountered into the situations that the setup is still incorrect after we follow the instruction. Then we spend time debugging and adding what we find into the documentation and hope the next person will fine. Or you might receive emails asking for dev environment passwords/secrets every few weeks when someone new join your team.

In other cases, we might need to work with multiple repositories in order to ship a large feature. Each repository has its own settings, sometimes even conflict with each other. One exmaple I encountered is the IIS app pool's identity settings, two repositories need different identity and both services need to run in IIS. It took me some time to setup correctly. 

![](/images/docker.png)

<!-- more -->

A great tool `Docker` may change the game. The fundamental concept is to run or debug your application or service inside a docker container, while you still develop in your local machine with your favoriate tool you like. Once you finished your code change, you can quickly build up a new image and run or debug it.

As an exmaple, I will use a ASP.NET Core web application as an example. We have one of our major service running in this environment. I hope you could get some ideas from this simple examples.

## Using Docker as the Dev Environment

First of all, you need to install docker. If you haven't, the docker official website provides great tutorials on how to do it on any operating system. Now I assume we have docker installed and running well.

I created a ASP.NET Core application from commandline like the following.

```bash
mkdir dockerexample
cd dockerexample
dotnet new mvc .
```

Within the current directory, if you build and run the application, you should be able to see the website from `https://localhost:5000`.

```bash
dotnet restore
dotnet build
dotnet run
```

Next step is to create a file named `Dockerfile` in the directory to tell docker how to build the image and what needs to run within the image. Microsoft provides the ASP.NET Core image [\[1\]][1].

```bash
FROM microsoft/dotnet:latest
COPY . /app
WORKDIR /app
 
RUN ["dotnet", "restore"]
RUN ["dotnet", "build"]
 
EXPOSE 5000/tcp
ENV ASPNETCORE_URLS http://*:5000
 
ENTRYPOINT ["dotnet", "run", "watch"]
```

The above example Dockerfile is to pull the latest Microsoft ASP.NET Core image, then add the application code from the current directory. At entry point, the image will run the ASP.NET Core application at port 5000 which is exposed from the image.

Now, you can build the image with the following command:

```bash
docker build -t example:demo .
```

To run the docker image, using the following command:

```bash
docker run -p 8080:5000 -t example:demo
```

If you run `docker ps`, you should be able to see your container is running.

```bash
$ docker ps
CONTAINER ID        IMAGE                   COMMAND             CREATED             STATUS              PORTS                    NAMES
d201d7eb9a21        example:demo   "bash"              26 seconds ago      Up 24 seconds       0.0.0.0:8080->5000/tcp   blissful_morse
```

Open the browser and go to `https://localhost:8080`, you will see the website is running perfectly. Note that the port number has changed to 8080 because we mapped the port between localhost and the container. The app will run at port 5000 inside container, but mapped to port 8080 from localhost.

![](/images/docker-web.png)

## Publish Your Docker Image for Your Team

Nowadays, most of teams should use cloud to provide their services. [Azure Container Service][4] or [AWS EC2 Container Service][5] are good places to publish and share your images with your team. From those documentations you will see how easy it is to publish, update and deploy your images. Whenever development environment changes, the whole team just need to do a simple pull from the registry to get the most updated image to develop their code.

## Debugging Experience

If you are using Windows and Visual Studio 2017, you can easily debug your code in Visual Studio while running your code in the docker image. [WANNABEEGEEEK][2] provides a great post on how to setup debug ASP.NET Core from a container. Basically, there is no difference when debug in localhost and in a container. So enjoy the free tool Visual Studio 2017 provides. Or if you are running node.js application, and you can also easily debug through Visual Studio Code like [this post][3] describes.

As we can see, it is not difficult to migrate run a container and use it. I think the most tricky thing is to migrate all your settings into an image for the first time. Once someone on the team is done, it will be a huge benefits for the entire team. 

> No more concerns about dev environment changes, it's just a pull and develop! You can develop as fast as your native localhost machine.

[1]: https://hub.docker.com/r/microsoft/aspnetcore/
[2]: https://wannabeegeek.com/2016/12/16/debugging-asp-net-core-apps-running-in-docker-containers-using-vs-2017/
[3]: https://alexanderzeitler.com/articles/debugging-a-nodejs-es6-application-in-a-docker-container-using-visual-studio-code/
[4]: https://azure.microsoft.com/en-us/services/container-service/
[5]: https://aws.amazon.com/ecs/?nc1=h_ls