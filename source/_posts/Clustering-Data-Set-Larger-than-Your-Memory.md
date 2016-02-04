title: "Clustering Data Set Larger than Your Memory"
layout: post
tags:
  - clustering
  - data mining
  - big data
  - mahout
  - hadoop
  - map/reduce
  - MySQL
category:
  - technology
date: 2012/2/25
---

> I thought I would never touch data size larger than my workstation's memory. But I was wrong!

One of the most exciting things doing research is to challenge yourself by facing situations you thought would never happen. My current scenario is to cluster a data set with more than 40GB. Obviously, there are multiple ways to resolve this challenge. Among those solutions, I prefer Apache Mahout!

<!-- more -->

Apache Mahout is a kind of data mining/machine learning tool taking advantages of the high throughput computation framework: Map/Reduce. It decompose the clustering algorithm, for example the k-means clustering, into several steps that each step runs in Map/Reduce mode.

In the rest of this article, I will take the k-means as an example to illustrate how mahout works in terms of implementation and practice.

Before I moving forward, if you are not quite familiar with Map/Reduce and why we use Map/Reduce, you can find answers in the following place:

* Original Paper from Google: [Google File System][1] and [Map/Reduce][2]

* Apache [Hadoop][3] Map/Reduce Project

* Map/Reduce [Wiki][4]

## kMeans in Map/Reduce

Now you have learned Map/Reduce and let's start using it to solve our clustering problems.

There are typically four kernel component of Mahout's k-means algorithm: kMeansMapper, kMeansCombiner, kMeansReducer and kMeansDriver. Each of these four components is coming from the Map/Reduce framework.

1. kMeansMapper:

* Read a point from data set.

* Calculate the distance among k clusters and find the nearest cluster. Output the key-value pair: cluster id and the cluster observation.

2. kMeansCombiner:

* Locally receive all key-value pairs from mapper and partially aggregate the pairs.

* Combine them and output cluster id, the cluster observation.

3. kMeansReducer:

* Only ONE reducer.

* Receive all key-value pairs and calculate new centriod for each cluster. The output is cluster id, cluster centriod.

4. kMeansDriver:

* Control each iteration until the centroid converges or until the maximum iteration reached.

* Each iteration relies on some temporary file to store n-th iteration's clusters.

* Final step will move the results to final output directory.

The above is the how the k-means cluster architects, but there are some practice details when you practice.

### Sequence File Preparation

First, most of the cases when we want to do clustering to our training data, we use CSV file. However, Apache Mahout only cares [Sequence File][5]. It did bring some trouble for me to reshape my training data set.

In order to solve this problem, I wrote a dedicated translation program to convert csv file into sequence file. This program can be both run sequentially and in Map/Reduce. To simplify it, I use sequentially running as my default preference. Some basic steps are listed in the following:

* Read a line from your csv file.
* Tokenize the string and put them into a Vector.
* Use line number as key, then output the data Vector to the sequence file.

If you original store your raw data in the MySQL database (just like what I did), you have to involve an extra step to export data from your database to a raw csv file. If possible, try the following command:

```sql
select * from [your table] into outfile [your csv file]
fields terminated by "," line terminated by "\n";
```

Once you have the sequence file in your local disk, you can run Mahout's k-means in command line.

## kMeans in Practice

Suppose you have the sequence file called raw.seq, and you have your Hadoop cluster running. You can create a directory store your output clustering result:

```sh
$ hadoop dfs -mkdir /user/hduser/kmeans-results
```

An interesting thing is that the input file can be locally stored! You don't need to push your input sequence file into HDFS. So you just calling the kmeans clustering through command line:

```sh
$ mahout kmeans -i raw.seq -o /user/hduser/kmeans-results/output
-c /user/hduser/initial-clusters
-dm org.apache.mahout.common.distance.CosineDistanceMeasure
-x 5 -cd 1.0 -k 20
```

If you want to know the full set of command of k-means, you can just type:

```sh
$ mahout kmeans -h
```

Now, if everything goes fine, you should have seen the results. Actually, it takes me about 4 minutes to cluster the 40GB training data.

[1]: http://dl.acm.org/citation.cfm?id=945450
[2]: http://dl.acm.org/citation.cfm?id=1327492
[3]: http://hadoop.apache.org/mapreduce/
[4]: http://en.wikipedia.org/wiki/MapReduce
[5]: https://builds.apache.org/job/Mahout-Quality/javadoc/org/apache/mahout/common/iterator/sequencefile/package-summary.html
