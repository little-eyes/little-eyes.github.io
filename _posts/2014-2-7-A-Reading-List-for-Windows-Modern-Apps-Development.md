---
title: "A Reading List for Windows Modern Apps Development"
layout: post
tags: windows, smart phone, apps
---

Recently I have been working on some investigation of modern apps development on Windows platform, so I think it might be necessary to have a reading list for the new developers to start their journey. 

## Basic knowledge of Windows Store/Phone App

Every app will have two parts: UI and app core, and we know there are so many technologies can power up either one of this. One of the unique feature of Windows modern app is its support of multiple language and UI design approach under the same platform -- Windows. So a good start can be from ["Meet Windows Store Apps"][1]. 

In that article, it briefly mentions the languages and technologies you can use to create an app. XAML and HTML5 are two major approaches to create UI, and VB, C++, C# and Javascript can power the app core. So it is good to go through the tutorials in different languages.

* [C++/XAML tutorial][2]
* [C#/XAML tutorial][3]
* [HTML5/Javascript][4]
* [C++/DirectX][5]

Also, it is worthy to read the languages' roadmap on MSDN so that you may have a better idea which language is a good fit for your needs.

* [Roadmap of C++ with XAML][6]
* [Roadmap of C#/VB with XAML][7]
* [Roadmap of HTML5 with Javascript][8]

Back to UI part, two approaches XAML and HTML have both advantages and disadvantages. Go through the navigation pattern of Windows Store App and Phone App may give you some idea about the flexibility and how much you can control the UI. Then you will see the different control list of XAML and HTML.

* [Store App Navigation Pattern][9]
* [Phone App Navigation Pattern][10]
* [List of XAML-based UI Controls][11]
* [List of HTML-based UI Controls][12]

For Windows Phone development environment, I would recommend you to go through some specials about XAML concepts and design library.

* [Windows Phone XAML Concepts][13]
* [Windows Phone Design Library][14]

After you have some fundamental idea of the app development, you may have a question about how the UI part interact with the user. Well, this is obviously working through `events`. Then I think you need to read a little about how the `event-handling` works. Again, this is language dependent and Windows Phone has a different name set of its events.

* [XAML-based UI][15]
* [HTML5/Javascript-baed UI][16]
* [Events for Windows Phone][17]

Now, if you are at language choice decision stage, you might want to read [this article][18] on MSDN.

## Some Advanced Questions

### Q1: Can we share the a library across Windows Store Apps and Phone Apps?

The answer is absolutely YES. Generally, two ways to do it: `Windows Runtime Component` and `Portable Class Library`. For Windows Runtime Component, you can create it in C++ or C#, and consume it from C++, C# and Javascript. It is a very powerful and controllable way to share your app core across the windows platforms.

| Platform | Create      | Consume                 |
| -------- | ----------- | ----------------------- |
| Windows  | C++, C#, VB | C++, C#, VB, Javascript |
| Phone 8  | C++         | C++, C#, VB             |

The C++ example on MSDN can be found here: [Create Component][19], [Consume Component][20]. Also, the Bing Maps Trip Optimizer is a good real example that use Javascript to power the UI and C++ to power the app core ([The article][21]).

If your app consider XBOX 360 or potentially XBOX ONE, the [Portable Class][22] is something you are looking for because it covers more than just store app and phone app now. But you can only use C# to create the portable class. The difference between portable class and the runtime component is that portable class is binary level which is powered by .NET 4 platform, while runtime component just share the same code and API which needs compilation for different platform. A sample app use portable class is [PixPresenter][23].

### Q2: Multiple screen size or different DPI, how to handle it?

In general, the problem has been automatically solved by XAML if you use flexible controls such as Grid, CSS Grid and CSS multi-column layout. Fixed layout design is not recommend except for some game apps, so I would recommend you to read [this guide][24]. For Windows Phone, the rotation may need some manual work to make the UI more smoothly, like change the position of some buttons. ([More to read here][25])

What if you have a different screen pixel density and I have photos to show? The answer is you always use higher quality graphics to scale down instead of lower quality graphics to scale up. ([More information is here][26])

### Q3: Can we mix the UI design lanugages (HTML5/XAML)?

Well, you may feel strange why we ask this question? Because some people care about performance, so HTML5/Javascript app becomes their problem, then they would prefer C++/XAML style. However, Javascript's data visualization brings a lot of convenience and impress to developers and users. So can we use them half-half? 

Currently, it is not possible for your to write your UI with both XAML and HTML5, but XAML and DirectX is possible. Or you can use a `WebView` to host your HTML and Javascript part, but you have no native access in this way.

### Q4: How can we integrate it with SkyDrive or Dropbox?

Each of them have REST API to use, so C# or Javascript based modern app may be more efficient to develop. For SkyDrive, you need to use Live API which needs credentials in your app, but you can always obtain them by becoming a store app/phone app developer. Note that the credential channel is different from each other. ([Article][27])

One more thing you need to know about the Live API is the `Scope and Permission`, which generally defines what security and privacy level your app is on so that the user may have a sense to control how they want to use your app. ([Article][28])

[1]: http://msdn.microsoft.com/en-us/library/windows/apps/hh974576.aspx
[2]: http://msdn.microsoft.com/en-us/library/windows/apps/hh974580.aspx
[3]: http://msdn.microsoft.com/en-us/library/windows/apps/hh974581.aspx
[4]: http://msdn.microsoft.com/en-us/library/windows/apps/br211385.aspx
[5]: http://msdn.microsoft.com/en-us/library/windows/apps/br229580.aspx
[6]: http://msdn.microsoft.com/en-us/library/windows/apps/hh700360.aspx
[7]: http://msdn.microsoft.com/en-us/library/windows/apps/br229583.aspx
[8]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465037.aspx
[9]: http://msdn.microsoft.com/en-US/library/windows/apps/hh761500
[10]: http://dev.windowsphone.com/en-us/design
[11]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465351.aspx
[12]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465453.aspx
[13]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj206948(v=vs.105).aspx
[14]: http://msdn.microsoft.com/en-US/library/windowsphone/design/hh202915(v=vs.105).aspx
[15]: http://msdn.microsoft.com/en-us/library/windows/apps/hh758286.aspx
[16]: http://msdn.microsoft.com/en-us/library/windows/apps/hh700412.aspx
[17]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/cc189018(v=vs.105).aspx
[18]: http://msdn.microsoft.com/en-us/library/windows/apps/dn465799.aspx
[19]: http://msdn.microsoft.com/en-us/windows/apps/hh441569(v=vs.94).aspx
[20]: http://msdn.microsoft.com/en-us/windows/apps/hh755833(v=vs.94).aspx
[21]: http://msdn.microsoft.com/en-us/windows/apps/hh699886(v=vs.94).aspx
[22]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj714086(v=vs.105).aspx
[23]: http://code.msdn.microsoft.com/wpapps/PixPresenter-Code-sharing-39ed631f
[24]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465349.aspx
[25]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj207002(v=vs.105).aspx
[26]: http://msdn.microsoft.com/en-us/library/windows/apps/hh465362.aspx
[27]: http://msdn.microsoft.com/en-us/library/live/hh826541.aspx
[28]: http://msdn.microsoft.com/en-us/library/live/hh243646.aspx