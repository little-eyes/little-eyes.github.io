title: "You Need to Know About Your flight"
layout: post
tags:
- machine learning
- azure ml
- data science
category:
- technology
date: 2015/10/30
---

![Alt text](/images/delays.png)

<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="/downloads/code/papaparse.min.js"></script>
<script src="http://code.highcharts.com/stock/highstock.src.js"></script>
<script src="/downloads/code/flights.js"></script>

> Due to some interactive visualization graphs, we strongly recommend you to use a computer's browser to read this article.

For many times, I get delayed for my flight due to multiple reasons: weather, carrier, security, etc. I never thought of why and what exactly happened for the flights and airports across the United States until I go through the flight data for the past years. I feel there is a strong need to visualize and discuss the insights for the delays that every one of us encountered before.

Department of Transportation's flight data starts from a while ago, but I am not planning to use all of them. Instead, I choose the data from 2011 which is the first year I came to United States. Let's first take a look at some facts throughout these years.

<!-- more -->

### Airport Delays over the 5 years

The first thing come to my mind is the most busy airport in US. To be more specific, I split it into two parts: departure and arrival. To be honest, it is quite surprising to realize that Atlanta GA is the busiest airport for the past five years though Chicago IL is understandable. Another interesting phenomenon is the departure and arrival popularity is not identical for those big airports. That raise a flag that there might be something interesting about the asymmetry.

<div id="airportPopularity"></div>

Next, you might wonder the worst delay should happen in either Atlanta or Chicago. If we consider the `Delay Ratio` as the number of flights delayed divide the total number of flights, then neither of them are the the worst airport in the US. In contrast, Atlanta airport is pretty efficient with only around 35% delay ratio comparing to Denvor's 48%. But it worth knowing that Denvor and Las Vegas might get you delayed in a roughly 1 out of 2 flights.

<div id="airportDelay"></div>

To breakdown the delays, interesting stuffs start coming onto the surface. We used to hear from the airlines that we are delayed or canceled because of the weather. However, the data below tell you a different story. The biggest cause for delay (including departure and arrival) is `Late Aircraft`. That means the plane is late coming here. So we might think why it is late? Does it come late because of the weather over there? I doubt this to be true because all those airports share the same pattern without being affected by the weather. The second cause is the `NAS` which I really doubt the efficiency of the system to handle so many planes in the air or need to be in the air.

<div id="airportDepDelayBreakdown"></div>
<div id="airportArrDelayBreakdown"></div>

Lastly, we aggregate the delays to display the average monthly delay for airports during the last five years for each airport. The following interactive graph may give you a sense of how the delay ratio changes within a year. You may already noticed that the ratio dynamics are very different from airport to airport, though a general pattern is Christmas and summer time (both are good time to travel). But there should be a lot of conclusions you can draw from the chart. We do notice some interesting points as well which we will put in the next few blogs in details.

<div id="airportDelayRatioTimeline" style="min-width: 900px;"></div>
