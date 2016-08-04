title: "Selenium Web Driver, CasperJS, PhantomJS and the web UX testing"
layout: post
tags:
  - javascript
  - testing
category:
  - technology
date: 2016/8/3
---

For many of you work in the web UX development, the testing part is one of the biggest challenges you need to address in order to ship your feature good and efficient.

## Selenium Webdriver

Among the many ways of testing, `Selenium Webdriver` becomes one of the most popular methods to drive the web testing. For those who are not familiar with the `Webdriver` concept, checkout the [Selenium office website][1].

The webdriver concept is very straightforward that you write some script to driver the browser's behavior like a monkey. You can mimic a user's behavior like click buttons, scroll down. You can check certain DOMs exist or not. 

<!-- more -->

In case you need multiple web browser testing, webdriver provides many browser's driver like Chrome, Firefox and Safari etc. You can use one script to test on as many web browsers as possible. The reality, however, is that the same code may not always work due to different browser's tricky parts.

So far, Selenium webdriver support many different languages: Java, C#, Python, Ruby, PHP, Perl and Javascript. This benefits pretty much covers all of the mainstream web development language. For those whose primary languages are pretty much C# and Javascript, the simple example could be as the following.

```csharp
using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;

using OpenQA.Selenium.Support.UI;

class GoogleSuggest
{
    static void Main(string[] args)
    {
        using (IWebDriver driver = new FirefoxDriver())
        {
            driver.Navigate().GoToUrl("http://www.google.com/");
            IWebElement query = driver.FindElement(By.Name("q"));
            query.SendKeys("Cheese");
            query.Submit();

            var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
            wait.Until(d => d.Title.StartsWith("cheese", StringComparison.OrdinalIgnoreCase));
            Console.WriteLine("Page title is: " + driver.Title);
        }
    }
}
```

The integration with Visual Studio and Visual Studio Online is very good as well. So you can easily bring this UX testing into the your testing workflow before you ship your feature.

## PhantomJS Headless Rendering

Option No.2 takes the UX testing steps even further. A headless browser does not require a foreground browser to show up. All the rendering is done in the background process. In other words, I usually treat it as the `F12 developer window`. So you write Javascript to operate the page tough you do not see it.

That means, if the page you are navigating has jQuery, then you can use it. The concept looks exactly like your F12 window. However, PhantomJS does provide ways to inject any JS library if you need it.

To operate on PhantomJS, you need to know a little of Node.js as well, especially the `require`, `fs`, etc. PhantomJS uses `WebKit` to render the page, so it might be a little different from real browsers. But 99% should be the same as usual.

A simple evaluate on Google's page title is the following.

```javascript
var page = require('webpage').create();
var url = "https://www.google.com";
page.open(url, function(status) {
  var title = page.evaluate(function() {
    return document.title;
  });
  console.log('Page title is ' + title);
  phantom.exit();
});
```

## CasperJS Testing Framework

There are many headless testing framework as you can see it from [here][2]. `CasperJS` is one of the them I feel it works pretty well with PhantomJS.

CasperJS provides a good pattern for you to explore your testing step-by-step. `Promise.then()` is the approach CasperJS takes. In addition, CasperJS wraps some common usage APIs like `assertExist()`, `assertTitle()`, `waitForSelector()`, etc. for you so you do not need to worry too much. 

As a result, you can quickly experience CasperJS via the following code snippet. 

```javascript
var casper = require('casper').create();

casper.start('http://casperjs.org/', function() {
    this.echo(this.getTitle());
});

casper.thenOpen('http://phantomjs.org', function() {
    this.echo(this.getTitle());
});

casper.run();
```

Since CasperJS/PhantomJS is headless rendering it does not require you to install Chrome or Firefox on your computer. This opens a big door for continuous integration. CI services like `TravisCI` and `Visual Studio Online` can run CasperJS without a problem. Selenium is different, you need the existance of certain browser in order to test on the page. 

> Final words, choose your best tool to help you!

[1]: http://www.seleniumhq.org/projects/webdriver/
[2]: http://phantomjs.org/headless-testing.html