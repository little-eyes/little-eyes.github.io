title: "Who is responsible for your flight delay?"
layout: post
tags:
- machine learning
- azure ml
- data science
category:
- technology
date: 2016/1/4
---

We talked about some facts of the airplane delays in this blog earlier, however, we did not go deeply into explaining why or even who is responsible for your delays. We just provides some basic statistics to give you a general sense what and how contributes to the airplane delays.

# Weather does not affect that much directly

There are four major reasons for the flight delays: **weather, carrier, late aircraft and NAS**. And the basic statistics tell us that weather is not that bad for the flight delays `directly`. We go a little in details by showing you a normalized scattered plot between total departure delays and its factors (weather, carrier, late aircraft and NAS) with a 5% sample of the original 5-year data.

![Alt text](/images/delay_factors.png)

A linear model is applied here to figure out the blue line in the curve which exhibits a regressed relationship between the factor and the total delays. Note that both x-Axis and y-Axis are normalized minute, so that all four factors will be on the same scale (mean value = 0 and standard deviation = 1). Therefore, if weather delays increase 1 normalized minute, it will bring roughly 0.22 normalized minute into the total delays.

Similarly, carrier contributes 0.6 normalized minute, late aircraft contributes 0.625 normalized minute, and NAS adds 0.25 normalized minute to the total delays when each of them add one normalized minute. So now you know the late aircraft and carrier becomes two major issues.

# So does weather matter?

# What's the casal-relationship among weather, carrier, late aircraft and NAS?