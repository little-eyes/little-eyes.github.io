title: "Engineering Your Site to PaaS and Continuous Integration"
layout: post
tags:
- infrastructure
- azure
- PaaS
- Continuous Integration
category:
- technology
date: 2015/11/21
---

Platform-as-a-Service (or PaaS) is one of the modern cloud technology that help you reduce your operational cost for your websites or other services. It helps remove the distractions of developers from deployment and operation monitoring, etc. In addition, it easily embraces other cool features like A/B testing with continuous integration. Continuous Integration is not a new concept but it was not easy to build such a system and maintain it inside your team. So a regular cadence deployment was widely used. However, the benefits of cloud computing brings the possibility to overcome those challenges in a single click.

<!-- more -->

According to __wordpress.com__, 25% of the Internet is using Wordpress, so I would like to use wordpress as an example to show you how to engineer your site into a PaaS environment and apply continuous integration in your site. Maybe you will ask why I need to continuous integration for the fully-engineered site like wordpress? And why not just use FTP to copy the site and deploy only once, then use all sorts of plugins? The answer is obvious that you don't have to unless you know your site is going to be changed frequently in a very customized way. However, PaaS still brings a lot of benefits to the wordpress site. For instance, scalability and CDN may be two things you are thinking of. When you have a large among users hit your server, you can scale out your services by simply clicking on Azure or AWS's management console. With their built-in CDN, it relive the service's stress a lot which leads to lower cost.

### Github Repo

People may wonder why do we need to setup a Git repo for our code. My suggestion is that `think future`. It is possible for a startup to grow and have more than one engineers to contribute, so Git is one of the best platform that enables a good collaboration among the engineers. This step is so easy by simply create a repo in Github and start using this Git repo.

### Create Azure Web app

There is a very good article to [start creating an Azure Web app][1], it supports most of major platform from PHP to Node.js and ASP.Net. Once you have created your own web app, you will see the following views in the Azure Management Portal.

![alt text][2]

### Setup Deployment connection with Github

From the screenshot above, you will easily see the settings there, then click it and scroll down, you will find settings related to `publishing`. These are the sections you need to make sure configure correctly before you announce your website.

![alt text][3]

Very clearly, you will see what you need: continuous deployment, deployment credentials and deployment slots. If you click the first one, then you will need to setup and connect to your Github account which is very straightforward. Once you finish that step and you will see the following screenshot with your site's initial deployment.

![alt text][4]

After you connect to your Github, then your code will get deployed every time you push to the branch you selected and the deployment will reflect on the deployment setting as well.

### Deploy and A/B Testing

A/B testing is my favorite part because it could tell me how people like our site or not. Azure provides a super easy way to make this happen. The only thing you need to do is to create a new deployment slot and setup how you want to deployment to the new slot. The alternative deployment slot could be exactly the same as the production one as well. If wonder how does it handle with the multiple instances (duplicated instances to reduce the burdens come from the users), the solution is clear in Azure: every deployment slot will have the same number of instances and it will be swapped all together. Following screenshot is the control tower to swap different slots that you can change your site at any time.

![alt text][5]

However, this only provides capability to swap different versions of your website but it is not serving both versions at the same time. There is a feature called `Traffic Routing` which enables you to start the traffic routing of two slots at a certain percentage.

![alt text][6]
![alt text][7]

### Conclusion

Now you should be able to run your website and A/B testing. One last thing I want to point out is that PaaS and continuous integration are not limited to Azure, it is also available in AWS as well. So if you are a pure Linux guru, I would suggest you give AWS a shot, then enjoy the rest of time developing your feature work and forget about engineering problems.

[1]: https://azure.microsoft.com/en-us/documentation/services/app-service/web/
[2]: /images/web_dashboard.png
[3]: /images/publish.png
[4]: /images/azure_deployment.png
[5]: /images/web_app_swap.png
[6]: /images/routing.png
[7]: /images/traffic_routing.png