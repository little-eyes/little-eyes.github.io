title: "Engineering System: Feature Preview and Continuous Integration"
layout: post
tags:
- infrastructure
category:
- technology
date: 2016/2/4
---

With continuous integration we have an automated pipeline from writing code to deployment. This helps developer to improve the efficiency and productivity. However, there is another case that we might meet: what if I want to preview my feature? Intuitive answer to this is that you can open another environment for this and redirect the traffic to your preview site.

Unfortunately, the problem is more than a simple redirect. The way I look at preview has two scenarios: first, you want to preview the site to context-free users, in which case you can use randomly or statistically selection. Second, you want to preview the site to context-aware users. For example, you want to preview the site to certain user after the authentication and you may also want to preview your site to people in certain department.

<!-- more -->

The first scenario can be easily addressed with with experimentation (or A/B testing). In fact, I would treat the first scenario as an experimentation case directly. Many cloud providers like AWS and Azure already provides good solutions for experimentation. However, the second scenario is interesting because I care more about the following things:

* Preview is temporary.
* Automated preview setup and teardown.
* Developer can easily get started.
* Minimize maintenance cost and hosting cost.
* Multiple isolated preview simultaneously.

To automate preview setup and teardown, that means you do not want to use `if-preview` kind of code (or we call `feature-toggle`), because you need a lot of extra efforts to teardown later. To provide easy access for developers, you have to make sure the design will simplify the setup and teardown. Finally, we can share resource among multiple active preview features while isolate them into virtual apps.

![Alt text](/images/preview.png)

So the idea comes from Git hooks and IIS virtual apps. Git hook is universal and widely adopted in many different areas. There are good Git hooks in Visual Studio Online as well. IIS virtual apps provides an easy automated setup and teardown with PowerShell. Therefore, you could ask yourself a question: how about treat any branch name with `preview/*` as branches need to setup the preview and teardown later?

That's the above picture shows. We can setup a Git hook for `preview/*` branches, then use the same CI deployment. In the end, we need a PowerShell script to automate the setup/teardown process. Check out [site1][1] and [site2][2] for detailed information about IIS and PowerShell. Other platforms like Django, Jekyll and Node.js should also have similar application scenarios which you could search for.

Therefore, any updates from preview branches, will gets continuous integrated into a virutal app in IIS. For instance, Alice has a feature `a` which she puts into `preview/alice/a` branch. Once Alice push the preview feature branch to Visual Studio Online or other CI services, her preview feature will be mapped to a virtual app `http://preview.xxx.com/alice_a`. In the meantime, Bob could work on something else and preview at the same server or container with `http://preview.xxx.com/bob_b`. Both features are co-exist in the server, but they are isolated by virtual apps.

In the scenario of Platform-as-a-Service (PaaS), you will heavily use container based apps. Therefore deployment slot concept makes more sense than IIS virtual apps. An idea here is to share the same name between feature name, deployment slot name and DNS name. For instance, you have a preview feature branch `preview/Ted/t`, will be deployed to slot `Ted-t` which can be accessed by `http://preview-ted-t.xxx.com`.

Finally, some small PowerShell scripts to help you understand the setup and teardown process.

```powershell
Import-Module WebAdministration
Get-Childitem 'IIS:\Sites\Default Web Site' | where {$_.Schema.Name -eq 'Application'}
New-Item 'IIS:\Sites\Default Web Site\DemoApplication' -Type Application -PhysicalPath C:\inetpub\DemoApplication
Set-ItemProperty 'IIS:\sites\Default Web Site\DemoApplication' -Name applicationPool -Value DemoPool
Remove-WebApplication 'DemoApplication' -Site 'Default Web Site' -Verbose -Confirm:$false
```

After the preview been setup, you can share the URL easily you want to present to, or show a link from the original site to certain user groups. When the preview phase end, developers just simply merge their code into `master` branch, then the code is in production now.

[1]: https://technet.microsoft.com/en-us/library/ee790599.aspx
[2]: https://technet.microsoft.com/en-us/library/ee909471(v=ws.10).aspx