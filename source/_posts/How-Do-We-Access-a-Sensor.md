title: "How Do We Access a Sensor?"
layout: post
tags:
  - html
  - javascript
  - mobile app
  - sensor
category:
  - technology
date: 2012/3/29
---

I am thinking of writing this blog just because I was thinking of this question last night.

So how many ways can we access a sensor, for example the gyroscope, on our smartphone or tablet? Definitely there is a couple approaches:

* You may use sensor API in your app. Take a look at some Android sensor topics starting from [here][1].

* You can even hack into the system level code and manipulate anything you like.

......

However, do we feel something not consistent here? Let's suppose we use a bunch of sensor API to build an app for our smarphone. But...which platform do you choose? iOS, Android or... It matters, right? It means a developer should spend extra time to transplant their code from one platform to another.

On the other hand, as we can see, web is the trend, mobility is the trend...The web technology brings us a universal access to information that most of people are using daily. In my opinion, the web is the simplest way to exchange information on the Internet. You do not need to worry too much about the platform, or just do some minor changes in your code. Thus, why not integrate sensor access into web?

I thought it was a big issue and might drive some research papers. I was even want to step into the field to propose a mechanism. Now the concerns seem to gradually disappear.

First, I am lucky to view the [PhoneGap][2] project which put their attentions on how to access sensors from JavaScript. Moreover, I heard that HTML5 seems like to cover the sensor API, but the standardization process could be long. Till now, the sensor API in JavaScript is provided by browser from browser. The Safri mobile on iPhone seems the first one to accomplish the goal. Check out the [documentation here][3]. In addition, Windows 8 has implemented the same functionality, please check the [sample app][4].

Unfortunately, the above two improvements seem to be at a very primitive stage that the sensor manipulation on top of the JavaScript is limited. One aspect is the speed, it has to depends on the process ability from the web browser's engine. I cannot say V8 is good enough to handle a highly dynamic and streaming sensor data.

Another drawbacks now can be the security issue, what JavaScript brings here is to make the sensor operation beyond your hook in the background so that you may not get a fully control.

The third one can be energy issue. I did an experiment that the sensors on the smartphone are extremely battery thirsty. They drop your battery level in an unbelievable speed. If the design is not efficient enough, the user should `hate` your web app.

Well, it is hard to say it will be a success accessing a sensor via JavaScript from a web, but it is worth trying. I think I should look more into it. :)

[1]: http://developer.android.com/reference/android/hardware/Sensor.html
[2]: http://docs.phonegap.com/en/1.5.0/index.html
[3]: https://developer.apple.com/library/safari/#documentation/SafariDOMAdditions/Reference/DeviceMotionEventClassRef/DeviceMotionEvent/DeviceMotionEvent.html
[4]: http://code.msdn.microsoft.com/windowsapps/Accelerometer-Sensor-Sample-22982671
