title: "In Love with Big Data Analysis - A Toolchain Summary"
layout: post
tags:
  - big data
category:
  - technology
date: 2013/4/5
---

> One must have good tools to do good jobs

For a long time we handle data within our single desktop or workstation, but the data explodes so quickly recently. The first situation of `big data`, meaningful to the public, appears when we want to search the whole Internet and the search should be realtime. Perhaps you want to handle the whole Internet with a super computer, but how much expensive it is? How many company or research institution can afford it? How can you guarantee it works? How long can it stand in the current Internet explosion? One of the cheap solutions is to use thousands of commercial machines such as your desktop.

Later, people start to notice the existence of _big data_ and it is everywhere. Then a huge number of researchers delve into the area and try to solve the huge amount of issues. Fortunately, we have come up with a series of good methodology and tools to help us handle the big data. Here, the use of big data is mainly about data mining, machine learning, realtime service, etc.

Among those tools, I would like to organize them into the following categorizes and discuss them in the rest of the blog.

* Programming Models and Infrastructures
* Databases and Interfaces
* In-memory Store
* Cross-platform/language Data Exchanges
* Machine Learning Library

## Programming Models and Infrastructures

An essential question: _why programming model matters?_

Before we talk about the reason, let us look at an example. You are asked to write a program to extract the unique English word used in all Wikipedia document. What you should do? Here are some solutions.

Solution #1: Write a short Python program. Basically, you go through all the documents and record the word in a dict. It takes more than 10 hours from my machine. Of course, you cannot tolerate such a slow speed.

Solution #2: Write a distributed or parallel program. Well, this time is much better, but you may spend a huge amount of time writing MPI code and debug your program. It can runs faster but MPI may not be able to use in other cases.

So, what about others? Yes, a team of engineers from Google solve this problem very well by proposing such a successful programming framework called `MapReduce`, which is supported by `Google File System`. Thereafter, people shortly understand the importance of this framework: the two systems can store the whole internet and can make index of it within an hour. What a huge jump, isn't it?

### Hadoop: the open source GFS/MapReduce

Apache Software Foundation rewrite the two system from Google's paper in OSDI 2006. Now the project is called `Hadoop`. It contains two parts: `HDFS` and `MapReduce core`. We are not going into details of Hadoop's architecture in this article because it worth another complete post. People use Hadoop in almost every big company who has big data. Hadoop is almost becomes the industry standards!

Hadoop is written in Java but it support C++, Java and Python as its MapReduce programming language. It works exactly the same as Google File System and its Map/Reduce. Some important terminologies are: `namenode`, `secondarynamenode`, `datanode`, `jobtracker`. The most important concept in Hadoop is the `job`, which means you ask a cluster of machines to work on a single job you want them to do. Obviously, this is a batch process.

### ZooKeeper: a service to be tough

The Apache ZooKeeper is designed to help us handle the complicated issues in the distributed system design. One of the tough issues is the synchronization. We may spend tons of time to deal with this issue if we are not familiar with the topic and even the researchers are working hard to overcome many new coming synchronization issues.

The ZooKeeper isolates the distributed services as an independent layer. Based on its APIs, we can easily build up robust distributed system. An example is the HBase system, which is the Google Bigtable implementation (we will talk about the details later). Some examples: [a simple Java one][1], [barrier and queue][2].

### Storm: the **realtime** framework

Even though Hadoop does an excellent job to handle a huge amount of data at a time, but it usually takes hours to finish a job on petabyte level data. Unfortunately, people are not satisfied with Hadoop because it cannot make things happen in real time. Twitter, for example, wants a system to analyze people's every single tweet, but Hadoop cannot finish the job within a second or even less time. Therefore, they invent a [Storm][3].

If you want to compute realtime, you have to let some machines running all the time. Therefore, Storm uses the idea of `topology` instead of `job`. Similar to Hadoop, a developer just need to specify a topology to handle a forever going work in a couple of lines of code. Then the workers will always work on the task until the developer decides to kill it.

Note that Storm is not a scratch-up project, it is on top of HDFS. This distributed file system is very useful in many cases so that people loves it everywhere. For Storm's application, I suggest you read Edwin Chen's [blog][4].

### PowerGraph: special for natural (social) graph

A special case in our current research, especially the social network research area, we have to analyze the social graph. The social graph fits well into [Power Law<][5], so a large number of nodes have very small number of edges. If we want to calculate the reputation of a person in the social graph, we needs to handle billions of nodes and billions of edges in the graph. Of course, a distributed system is necessary.

The fundamental idea is very simple that splits the graph by edges and lets one machine run a node's work. Cool idea, isn't? Oh, this idea can be implemented in Hadoop. For example, we can use the [PageRank][5] to represent the social importance and PageRank's Hadoop implementation is well known. But the message exchanges among the machines are exploding which dramatically increase the computation time.

A group of people from CMU proposes a clever idea to split the nodes instead of edges. So each node can be split into several sectors and each sector handles the computation locally, then shuffles the aggregated results. [PowerGraph][6], therefore, defines three programming interfaces: `gather()`, `apply()`, `scatter()`. The three simple APIs works perfectly with many social graph cases based on their benchmarks.

## Databases and Interfaces

Both small data and big data needs data management. Rational database system is one of the good solutions. But what if the column is so big to be handle at a time? Do you worry about the too large data stored in a single database? OK, distributed! and column-oriented!

### HBase: the Bigtable way

Apache HBase is an open source implementation of Google's Bigtable, the database that handles most of the structure data in Google. An essential question is the data consistency and version. HBase is not a "eventually consistent" database, it is a strong consistent one. Therefore, it handles the issue very carefully. Technically, HBase relies on ZooKeeper to help manage the synchronization among replication copies.

Note that not all cases are suitable for HBase. If you have only a few millions of rows or less, please do **not** use it. HBase has traded a lot of advantages of RDBMS (such as secondary index) for the "big". So you have no reason to use it until your data is really big.

### Hive and Pig: the bridges

As I have talked a lot about the tools, do you feel about the learning curve? Many of our analysts are not good programmers to handle the Map/Reduce stuff. They like SQL and always like. Therefore, a gap lies between the infrastructures and analysts.

Nevertheless, we have the solution: [Hive][7] and [Pig][8]. Hive, in my opinion, is a SQL to Map/Reduce translator. When you write a SQL like query, the query is actually executed in the Map/Reduce framework. If you interested in the whole framework, I recommend you to write a couple of SQL queries and implement its Map/Reduce executions by yourself. Pig, on the other hand, is more like a higher layer abstract programming language which enables us to analyze big data in a feasible. The analysts only need to focus on the application or programs semantics instead of executions. The execution efficiency has been guaranteed by Hadoop framework.

### NoSQLs: make things even faster

If you look at the data we are using, either structured and unstructured data. They can all be represented as `key-value` model. The pure key-value model can help speed up the query during runtime by using NoSQL style. In case that I do not have much experience in NoSQL field, I just list some possibility following. If you are more interested in NoSQL issues, [here][9] is a good place to start the journey. And also [this one][10].

#### [DynamoDB][11]

Instead of handle the big database in a master/slave way, Dynamo uses a fully distributed approach. The key-value store provides only two simple interfaces for major operations: `put()` and `get()`. In addition, Dynamo's replication ring has influenced many other NoSQL databases (check out the [full paper][12]).

#### [MongoDB][13]

As one of the most common use NoSQL databases, MongoDB is good at its low learning comparing to others like Cassandra. Written in C++ makes MongoDB very fast but it is document oriented. Data stores in JSON format with full index support. Besides, many of the data operation can be done with MapReduce.

#### [CouchDB][14]

Similar to MongoDB, CouchDB is also document oriented but it has JavaScript support for MapReduce. This feature may attract some developer working with Node.js and so on.

#### [ElephantDB][15]

The specialized database for exporting key-values data from Hadoop. We may have a lot of files on HDFS, ElephantDB helps you export key/value data from those files. This database comes with twitter's Storm which emphasizes the realtime analysis. Note that it supports random read but only batch write. This [slide][16] tells more.

#### [Cassandra][17]

Facebook initiates Cassandra but not widely used currently. It combines Bigtable and Dynamo's technologies. Different from MongoDB and CouchDB, Cassandra is a structured key-value store. The above databases are different from each other in many ways, such as interface, replication model, data model (key/value or document), etc. Please read [this article][18] for a better vision.

## In-memory Stores

Well, in-memory stores are used to handle faster data which can fit into your memory. It brings very good realtime issue performs for applications such as Youtube, Flickr, etc. However, this in-memory store seems not very related to the "analysis" part, so I just keep it as concise as possible.

### Memcached

Basically, [memcached][19] allows you to combine the memory from many machines to build a huge memory pool. For example, if you have 32 machines, each of which has 16GB memory, then memcached enables a 512GB memory pool for you. In such a pool, you can almost do anything you want. Therefore, `sharing` is one of the most important concept for memcached.

### Redis

[Redis][20] has more features that memcached does not integrated. One of the most interesting one should be Pub/Sub feature. It allows you to publish something in the memory, any other consumers need the data can automatically receive the data. So it is very easy to build a push/notification services. For example, if you tweet a post, all your followers can receives this notification almost immediately.

### RabbitMQ

[RabbitMQ][21] is more like a message service. Basically, it can form the following message topologies: work queue, pub/sub, routing, topics, and RPC. RabbitMQ is more reliable than Redis even though their functionality is similar. Especially when using [celery distributed queue][22], Redis may have some event loss.

## Cross-platform/language Data Exchanges

When dealing with distributed system, a more low-level problem is to make sure the object always has the same format in different machines. Some machines may have different operating system, such 64-bit and 32-bit. Even in the data center, they cannot have the exact same type of machines. So data transfer among those machines may crash the object. So a _protocol_ is necessary for the case. Again, this is too low-level, so we just describe some high-level things here.

### Avro Apache's

[Avro][23] is a typical data serialization system which provides rich data structure, compact-fast-binary data format, RPC and simple integration with dynamic languages. It relies on `schema` which is defined in JSON format. Comparing with other systems like Thrift and Google Protocol Buffer, it differentiate itself in dynamic tying, untagged data and no manually-assigned field IDs.

### Thrift

Another project from Apache Software Foundation is [Thrift][24], specific for cross-language development. The modern big data analysis system usually does not write in a single language because it need multiple languages' advantages together to achieve a good performance. Thus, Thrift appears as a compiler. The white paper from Facebook is [here][25].

### Protocol Buffer

[Protocol Buffer][26] was born in Google which handles most of Google's internal system. It is a flexible, efficient and automated mechanism for serializing structured data. Instead of simply using XML or JSON for object serialization, Protocol Buffer is smaller, faster and easier to use programmatically.

## Machine Learning Library: Apache Mahout

Now we have talked about a huge number of open source project regarding the big data infrastructure, but we have not touched the machine learning yet. The major service of the infrastructure is to provide a scalable environment for machine learning or data mining tasks.

Unfortunately, we also notice the tough learning curve on the infrastructure. Just image how hard it is to implement a _k-means_ algorithm for 1TB data if you have no idea of MapReduce. You need to know how to implement it in a Map/Reduce style and write the code carefully.

The good thing is we have come up with a solution by writing a library for you. [Apache Mahout][27]. This library is dedicated to implemented many machine learning algorithms in a scalabe way. Those algorithms include categorizes in `classification`, `clustering`, `pattern mining`, `regression`, `dimension reduction`, `evolutionary algorithms`, `recommendation and collaborative filtering`, and `vector similarity`. For a complete review of the algorithms, please look at the [official post][28].

Now, if you want to run an data analysis for about 1TB, the process becomes very clear. The following is an example to analyze the [Friendbook][29] data set. In this data set, we collected several people's motion activity recordings from sensors such as accelerometer, gyroscope and geo-location. The total number of data points is about 1 billion. And we use _k-means_ to extract their different motion behaviors.

The first step is to move the collected data into HDFS, and we serialize the data from CSV format to binary. Then we just simply run the following command: (inside the mahout home directory)

```
$ mahout kmeans -i /user/data/friendbook_training.in
-o /user/data/friendbook_training.out
-c /user/data/cluster.initial -k 15
```

After about 50 minutes, we have the results in the /user/data/friendbook_training.out directory. Honestly, Mahout has help us a lot to analyze many big data set with various machine learning algorithms.

> Well, finally we reach the end. I hope you have a better idea of what big data analyze means and its tool chain. It usually takes a while to get familiar with them. One good thing is that you can deploy any side of your cluster very easily buy using Amazon EC2. So why not try it out?

[1]: http://zookeeper.apache.org/doc/trunk/javaExample.html
[2]: http://zookeeper.apache.org/doc/trunk/zookeeperTutorial.html
[3]: http://storm-project.net/
[4]: http://blog.echen.me/2013/01/08/improving-twitter-search-with-real-time-human-computation/
[5]: http://en.wikipedia.org/wiki/PageRank
[6]: https://www.usenix.org/conference/osdi12/167-powergraph-distributed-graph-parallel-computation-natural-graphs
[7]: http://hive.apache.org/
[8]: http://pig.apache.org/
[9]: http://highscalability.com/blog/2011/6/20/35-use-cases-for-choosing-your-next-nosql-database.html
[10]: http://highscalability.com/blog/2010/12/6/what-the-heck-are-you-actually-using-nosql-for.html
[11]: http://aws.amazon.com/dynamodb/
[12]: http://www.allthingsdistributed.com/2007/10/amazons_dynamo.html
[13]: http://www.mongodb.org/
[14]: http://couchdb.apache.org/
[15]: https://github.com/nathanmarz/elephantdb
[16]: http://www.slideshare.net/nathanmarz/elephantdb
[17]: http://cassandra.apache.org/
[18]: http://highscalability.com/blog/2011/6/20/35-use-cases-for-choosing-your-next-nosql-database.html
[19]: http://memcached.org/
[20]: http://redis.io/
[21]: http://www.rabbitmq.com/
[22]: http://celeryproject.org/
[23]: http://avro.apache.org/
[24]: http://thrift.apache.org/
[25]: http://thrift.apache.org/static/files/thrift-20070401.pdf
[26]: http://code.google.com/p/protobuf/
[27]: http://mahout.apache.org/
[28]: https://cwiki.apache.org/confluence/display/MAHOUT/Algorithms
[29]: http://scialli.utk.edu/sensors-and-smarts-qing-cao/
