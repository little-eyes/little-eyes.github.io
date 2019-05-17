title: "U.S. Baby Names Since 1880"
layout: post
tags:
- machine learning
- data science
- python pandas
category:
- technology
date: 2016/2/10
---
![name](/images/name.jpg)

> There are many language choices and tools for data analysis such as R, SQL, Python, etc. This time I tried out a combination between `Python` and `Pandas`.

> [Data source from Kaggle datasets][1]. Charts are interactive, feel free to click and play with it.

**93,889** distinct names exist since 1880. Among those names the most popular 20 names are listed in the table below categorized by gender. You may find your names in the list.

<!-- more -->

| Rank | Female Name | Male Name |
| ---- | ----------- | --------- |
| 1 | Mary | James |
| 2 | Elizabeth | John |
| 3 | Patricia | Robert |
| 4 | Jennifer | Michael |
| 5 | Linda | William |
| 6 | Barbara | David |
| 7 | Margaret | Joseph |
| 8 | Susan | Richard |
| 9 | Dorothy | Charles |
| 10 | Sarah | Thomas |
| 11 | Jessica | Christopher |
| 12 | Helen | Daniel |
| 13 | Nancy | Matthew |
| 14 | Betty | George |
| 15 | Karen | Donald |
| 16 | Lisa | Anthony |
| 17 | Anna | Paul |
| 18 | Sandra | Mark |
| 19 | Ashley | Edward |
| 20 | Donna | Steven |

From the baby names, I think an easy start to learn is how many children were born each year and what is the trend for it? The following graph tells you how many boys and girls were born each year.

### Boys and girls born each year

Interestingly, the time around World War I and World War II are the two booming period for new born babies in the U.S. The great recession during 1930s definitely hurts the baby born rate as you can see the slide during the early 1930s and recover in the late 1930s. When time reaching 1960, the children born number is at record high while a big slide comes afterward. Both boys and girls share the similar pattern for up and down each year. After the 1930s recession, more boys were born than girls in general while before that time was the opposite.

<div id="population" class="chart-container tall"></div>

### Winner names over time for boys and girls

We know the most popular names in history but we also want to know if those names were the winner each year? The following two time span charts give you the idea. The most popular boys name `James` only won 13 years in a row. The winning names has a very consistent pattern that one name usually last a few years instead of scattered through time. For instance, the name `Mary` last 67 years in a row and come back to the winner place for another 10 years after the name `Linda` took the place for only 6 years.

<div id="girltimeline" class="chart-container"></div>

Similarly, the name `John` and `Michael` are two biggest winners in the name history. Unfortunately, most recent winning names seems to be affected by the popular culture more and more. For example, the 2013 - 2014 winner `Noah`, the 2008 - 2009 winner `Emma`, and the 2009 - 2011 winner `Isabella` remind me many popular movies during those years.

<div id="boytimeline" class="chart-container"></div>

Expand those winning names, we get to a chart of those names and the number of babies have those names each year. Apparently, there are two big booming at WW-I and WW-II, while the declining afterwards. Those _old_ popular names are obviously disappearing among U.S. born babies as you can see from the chart because the trend is shrinking. Among the names, `Lisa`, `Jennifer` and `Ashley` are emerging winners around 1970s and 1990s.

<div id="popular-names" class="chart-container tall"></div>

### Neutral names

I always heard boys' and girls' names the same. Then I wonder what are the popular `neutral` names for both boys and girls. Then I come up with the following criteria to select those names.

> The name has more than 20,000 usage in history for both boys and girls, while the usage difference between boys and girls is less than 10,000.

I thought it was a big subset of all the names, but only four names pass through the filter: `Frankie`, `Robbie`, `Riley`, and `Kerry`. Two peak points of those names are around 1960s and 2000s.

<div id="neutral-names" class="chart-container tall"></div>

### Name diversity

Since there are so many names exist in history, one question to ask is that new born babies' name are more diverse or not. **A simple model here is to evaluate the unique names being used each year**. So the answer is YES. We have more and more names, and the diversity is increasing in general, though we have a decline in recent 10 years. Therefore, it might be more interesting to see this in the next 10 or 20 years. Similar things happened from 1910s to 1930s, but after the great recession the diversity increased dramatically. The diversity increase is align with the children born number each year, but more aggressively increase.

<div id="diversity" class="chart-container tall"></div>

> In the end, I feel Python's `pandas` library is a good tool for manipulating data with great performance. It could be a great combination with `scikit-learn` if you are looking for python based machine learn/data science toolset.

[1]: https://www.kaggle.com/kaggle/us-baby-names

<style>
  .chart-container {
    width: 100%;
    height: 300px;
  }
  .chart-container.tall {
    height: 500px;
  }
</style>

<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="/downloads/code/papaparse.min.js"></script>
<script src="https://code.highcharts.com/stock/highstock.js"></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="/downloads/code/babynames.js"></script>