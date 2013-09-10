---
title: "Introducing ReCapture - A New Direction to Benchmark Smartphones"
layout: post
tags: android, benchmark, smartphone
---

`Benchmarking` has been studying for a long period of time, but most of the concentration has been put in PC field. People want to have a sense of the performance level of a PC or server from the benchmark results, so multiple different type of benchmarking method has been developed, such as [SPEC][1]. Some classic program to push the CPU performance is super-pi, which is to solve the value of pi as accurate as possible.

However, do you believe this type of benchmark will reflect the reality you are looking for? If you are seeking high performance servers: **YES**. But if not, you should think of it carefully. More serious cases is the smartphones. Do you want an extremely high performance phones or you need a normal phone? Usually the high performance phone requires more energy which means you may recharge the phone more than one time a day, and you need to spend more money. What if the phone is not super, but satisfies your need with decent performance. Which one do you choose? I bet most of you will choose the later one for battery issue and price issue.

So does it mean a lower score of some benchmarks will tell you this? The answer probably is _not_, because the purpose of the current benchmark is to find the most powerful devices instead of something **good** for you. You do not have any personalized criteria input or you do not even know what those criteria means. You probably want to say: 1) I want my Internet is fast; 2) I want my phone switch smoothly from app to app. So you have no experience how those scores could be mapped to your expectations.

##A user action based benchmark idea

Part of the above problem comes from the `benchmark methodology`. Personally, I really doubt the traditional benchmark will make a lot of sense for most people. Therefore, we believe the new benchmark mechanism on smartphones should be `personalized` and `in-reality`.

For `personalized`, I mean the benchmarks should consider the usage pattern of a user very well. For instances, someone may like games very much, the graphics and CPU performance should be very important factors, while business man may requires smooth app switch. For `in-reality` I mean the benchmark test should relies on the real usage of the user rather than ask the smartphone to calculate some fake problem which they will never do in reality.

From these two angels, we consider a two-step benchmark method:

* Usage Collection Stage 

Anyone who wants to test whether a smartphone is suitable for him or not, he can simply help himself by recording his previous smartphone usage for a while, say one week. During the week, we can collect the app usage details, such as when did he use the app, how long did he use? Note that the `privacy concern` may rise because we are collecting data. However, we are not planning to send the data to anywhere but store the data locally in the smartphone, then the user can always preserve the confidential data.

* Auto Recapture Stage 

Once we collect enough data, the benchmark program will take the _data_ as input, then based on the timestamp and duration of app usage to reconstruct an auto execution sequence. Then the benchmark start auto emulate the user's action on the new phone. In the meantime, the program will monitor the performance of the smartphone's CPU, battery, network and graphics, which will be used to generate the final report.

After the two stage, we are able to calculate the scores of the smartphone. In addition, the user can feel the experience of the phone by watching the execution of the benchmark. This feature helps a lot because you cannot really feel the experience of the phone if you only see some ridiculous calculation running on the smartphone but have nothing to do with your daily usage.

## Extra features/benefits

The most immediate extra features or benefits of the _ReCapture_ project I can think of is the data collection for researchers. Nowadays, the researchers in mobile system area feel hard to collect data about CPU, network and graphics from the daily usage of a user. Three things block the way:

* Legal/ethnic issue to collect data 

In fact, if the researchers want to collect the data from participants, an IRB approval must be obtained. [Dr. Welsh's blog][2] gives a clear description for this and the ethnics in research.

* Standard usage control

It is very hard to control the usage of a person, if you just tell him how to do. If you cannot control the standard normal usage, how can you claim the standard normal usage in the research paper? How can people trust the results? I always read papers saying "comparing to the normal usage", but they never define what is the `normal` and how to guarantee it.

* Multiple user at the same time

If you are interested in the networking issue on the smartphone, you may need to consider multiple devices. So do you want to ask a bunch of students to use their smartphone for a month? How do you control their usage?

Fortunately, we believe the ReCapture project can resolve them very well. First, we need to collect some app usage trace from users. The luck thing is that we already have plenty of such data, like the [Livelab][3] data set from Rice University. Second, the ReCapture project can auto execute the app trace in a human-manner. Meanwhile, the CPU, network, battery, etc. can be recorded. In addition, you can have multiple devices running at the same time to reduce the bias of the data set as much as possible.

Now the ReCpature project is under developing, the project source code is on [Github][4].


[1]: http://www.spec.org/
[2]: http://matt-welsh.blogspot.com/2013/01/the-ethics-of-mobile-data-collection.html
[3]: http://livelab.recg.rice.edu/
[4]: https://github.com/little-eyes/ReCapture
