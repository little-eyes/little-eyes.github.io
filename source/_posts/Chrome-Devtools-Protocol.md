title: "Chrome Devtools Protocol - UX Automation and more"
layout: post
tags:
- infrastructure
category:
- technology
date: 2017/9/2
---

![Alt text](/images/cdp-chrome.png)

Starting from Chrome 59 (60 in Windows), there are two things really shine Chrome in the field of UX automation and testing -- `Headless` and `the devtools protocol`. I was worked on a project to bring the UX automation and integration test for my team's web service. We started with `PhantomJS` which is a widely adopted tool to execute and render web pages in a headless mode. It provides lots of good features like execute Javascript, take screenshot, and navigate from page to page. This technology becomes our first version of UX testing tool. `CasperJS` is a good wrapper tool on top of PhantomJS which provides good interface for testing.

<!-- more -->

As we evolve our UI technologies, PhantomJS starts showing compatiblity issues with new features of Javascript. You always see rendering failure or console errors from PhantomJS but renders completely fine on Chrome or Edge browser. So we improved the tool to use `Selenium`, another widely adopted tool. Selenium can drive different kind of browsers, from IE to Chrome. It relief us for a few weeks until the performance and reliablity issues keep hitting us. So we have to move on to a better solution.

Then we learned Chrome already supports headless mode, which means you don't need anything else to render a web apge in the background process and it runs as fast as Chrome headful mode. Our needs for fast rendering is cirtical. We have a bunch of developers are actively contributing to the web service, everyday the code base is changing. So we want to run our integration test in browser every single time a developer check in a change. We cannot tolerate a slow render engine to finish the work because it slows down our agility. We also need to use the same technology to periodicaly check our pages so that we are aware of live site issues earlier than our customers. So we run some rendering checks against our production service as well, and we want to hear the results as fast as possible.

We find `Chrome DevTools Protocol (CDP)`, a protocol that uses JSON data as the commands to control Chrome browser remotely via websockets. This is like our normal F12 debugging window, but you can just program the behavior through your code.

Combining the headless and CDP makes a powerful tool for UX automation and testing. There are three scenarios need UX automation and testing in our project.

* **localhost**. A develop may want to quickly run some page checks before he/she wants to check in the code.
* **CI Envrionment**. Once a pull request completed, we will run the entire site again to check every page on our continuous integration environment. We will move the commit to release branch once the integration test passed.
* **Production Envrionment**. A period check is needed for our production service to alert us any live site issues.

### Architecture

![Alt text](/images/cdp-arch.png)

The fundamental idea is to run this as a REST service that the caller could pass a page URL, then we use CDP to remotely automate the rendering and page validation (e.g. the picture above). At localhost, you will need to run Chrome from the commandline like the following.

```bash
$ chrome --remote-debugging-port=9222 --user-data-dir=remote-profile
```

If you want to run headless mode just add `--headless` in the commandline.

```bash
$ chrome --remote-debugging-port=9222 --headless --user-data-dir=remote-profile
```

The port 9222 is open for devtools connection. `http://localhost:9222/json` is your management place. 

At localhost, you will see the chrome window get activated and navigated to different pages. You can create multiple tabs to run your pages in parallel and close them all later. The corresponding commands are the following.

- New tab: http://localhost:9222/json/new
- Close tab: http://localhost:9222/json/close/<guid>

At non-localhost environment, we still need a place with chrome installed and exposed. With the headless mode, we can use a very lightweight docker container that only runs Google Chrome inside. To easily scale out this service, we will need multiple chrome containers and use [Kubernetes][3] to manage it.

![Alt text](/images/cdp-tech.png)

So the new architecture becomes like the below graph. You may have multiple web service instance and a cluster of containers to run chrome headless. Both web service and container cluster can be scaled independently and very easily.

![Alt text](/images/cdp-cluster.png)

### Chrome Devtools Protocl

In order to send protocol commands to chrome, you probably need to use a package for [Node.js][1] or [C#][2].

#### A Node.js example

```javascript
const CDP = require('chrome-remote-interface');

CDP((client) => {
    // extract domains
    const {Network, Page} = client;
    // setup handlers
    Network.requestWillBeSent((params) => {
        console.log(params.request.url);
    });
    Page.loadEventFired(() => {
        client.close();
    });
    // enable events then start!
    Promise.all([
        Network.enable(),
        Page.enable()
    ]).then(() => {
        return Page.navigate({url: 'https://github.com'});
    }).catch((err) => {
        console.error(err);
        client.close();
    });
}).on('error', (err) => {
    // cannot connect to the remote endpoint
    console.error(err);
});
```

#### A dotnet core example

```csharp
using (var session = new ChromeSession("ws://...")
{
    var shouldCancel = new CancellationTokenSource();
    await session.Page.Navigate(new Page.NavigateCommand
    {
        Url = "http://www.winamp.com"
    }, millisecondsTimeout: 60000, cancellationToken: shouldCancel);
    
    shouldCancel.Cancel();
}
```

### Authentication and Distributed locking

If authentication is enabled on your page and you are using OAuth based autentication mechanism, you will need to be a little bit more careful because these authentication needs to access browser's localstorage for authentication token and a each container's multiple tab share the same local storage. 

It's possible that multiple requests will ask for the execution of the same page on the same container, and you will need to inject authentication token for each page. Since the local storage is shared within the container, you may undermined other page's execution when a page is trying to flush the local storage for authentication. Therefore, a distributed locking is preferred here to lock those local storage resources. You can easily use some distributed locking system such as [Redlock][4] to accomplish this goal.

[1]: https://github.com/cyrus-and/chrome-remote-interface
[2]: https://github.com/BaristaLabs/chrome-dev-tools-runtime
[3]: https://kubernetes.io/
[4]: https://redis.io/topics/distlock