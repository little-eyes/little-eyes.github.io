---
title: "A Memo to Deploy Hadoop Cluster in Hydra Lab"
layout: post
tags: hadoop, deployment, big data
---

> This is an article for the UTK EECS students who want to use Hydra lab (or similar school-operated lab) to set up a Hadoop cluster and process big data.

## A Brief Review of Hydra Lab Environment

Hydra lab is one of the most frequent use lab in the EECS department. The computer's hardware is absolutely powerful enough to deploy a small Hadoop cluster. A typical cluster storage capacity (30 Hydra machines) is around 7TB, which only occupies 50% of the total storage in the lab.

Besides the hardware details, several operating system (Ubuntu 12.04 LTS) deployment is very useful to help us quickly deploy a Hadoop cluster.

* First, the */home/netid* directory is actually a networked file system directory. In other words, if you copy a file to /home/netid/ directory via Hydra2 machine, then every other machine can access the data from the *same* directory path.

* Second, the /home/netid directory has quota limitation that the maximum storage is 2GB per user. So your home directory is not enough to support a Hadoop cluster which may contain data in terrabyte size. However, */local_scratch* is the per-machine directory that you can use as much as you want. Apparently, this directory is shared with others, but you can reach 500GB disk size if necessary.

* Third, unfortunately, the /local_scratch directory will be deleted within *two weeks* if there is no data change. So it's a good idea to touch the path on each machine every couple of days.

* Fouth, the Java environment root path is located in */usr/lib/jvm/java-6-openjdk*, which is different from a typical Ubuntu 12.04 LTS system after installing Java.

* Fifth, the DNSs of the Hydra lab's machines are very straightforward. For instance, the name of the Hydra machines are Hydra1 -- Hydra30, so the DNSs are hydra1.eecs.utk.edu -- hydra30.eecs.utk.edu. 

## Step-by-step Deployment

After we completely understand the features of Hydra lab, we can take advantages of them to quickly setup a Hadoop cluster.

### Step 1. Download Hadoop

To obtain a latest version of Hadoop software stack, you may want to use [this link][1]. There are multiple versions, but I would recommend you to use a stable version, for instance, Hadoop-1.2.1. In this article, I would use Hadoop-1.2.1 as the example.

You may download the Hadoop package into your /home/netid directory and I would recommend you to do so, because the /home/netid directory can be accessed by any Hydra machine under the same location, meaning that you do not need to copy the Hadoop package to every single machine in Hydra lab.

### Step 2. Configure Hadoop Environment

The `hadoop-env.sh` file contains the Hadoop environment parameters, among which the most important parameter is the *JAVA_HOME* parameter. So edit the `./conf/hadoop-env.sh` file by adding the following information.

	export JAVA_HOME=/usr/lib/jvm/java-6-openjdk

Besides this parameter, where to store the log file should also be in consideration. Hadoop will generate lots of logs, but our /home/netid directory has quota limitation. So we have to relocate the log files into the /local_scratch/. Add the following line into the hadoop-env.sh will change it.

	export HADOOP_LOG_DIR=/local_scratch/netid/hadoop/logs

### Step 3. Configure HDFS Site

As to the HDFS, three very important parameters need to be set in order to make sure the cluster in Hydra lab works properly. The three parameter are the following:

* `dfs.replication`: the number of replications.

* `dfs.name.dir`: the place for the namenode to maintain all the files in the distributed file system.

* `dfs.data.dir`: the place to store the data content on the slave nodes.

The HDFS site configuration is via the `./conf/hdfs-site.xml` file. So add the following XML block will apply the changes.

	<configuration>
		<property>
			<name>dfs.replication</name>
			<value>3</value>
		</property>
		<property>
			<name>dfs.name.dir</name>
			<value>/local_scratch/netid/hadoop/</value>
		</property>
		<property>
			<name>dfs.data.dir</name>
			<value>/local_scratch/netid/hadoop/</value>
		</property>
	</configuration>

### Step 4. Configure the MapReduce Site

The MapReduce Site information is mainly about the job tracker and its TCP port. So the configuration is simply edit the `./conf/mapred-site.xml` through the following XML block.

	<configuration>
		<property>
			<name>mapred.job.tracker</name>
			<value>hydra1.eecs.utk.edu:54311</value>
		</property>
	</configuratin>

### Step 5. Configure Master and Slaves

Typically, one master and several slave nodes are used in the Hadoop system. So we need to tell the Hadoop system which one is master and which nodes are slaves. In `./conf/masters` and `./conf/slaves` files, you can list the master and slaves accordingly. For instance, the ./conf/masters can be the following.

	hydra1.eecs.utk.edu

And the ./conf/slaves file can be

	hydra2.eecs.utk.edu
	hydra3.eecs.utk.edu
	hydra4.eecs.utk.edu
	...
	hydra30.eecs.utk.edu

After finsihing the above five steps, your Hadoop cluster in Hydra lab is ready to run.

## Start the Cluster

If you are using the cluster for the first time, you will need to format the namenode by the following command.

	$ ./bin/hadoop namenode -format

Two steps should be followed to start the cluster. The first one is to start DFS through the following command.

	$ ./bin/start-dfs.sh

Then you will see your terminal screen keeps popping message to write log into your `HADOOP_LOG_DIR`.

Then, you need to start the Map Reduce framework by execute the following command.

	$ ./bin/start-mapred.sh

Similarly, you will see the terminal screen keeps saying to write log to your HADOOP_LOG_DIR.

Finally, if you go to your web browser, and check the following two pages, which contains HDFS and MapReduce status details. You will see if your cluster has been started.

	http://hydra1.eecs.utk.edu:50030
	http://hydra1.eecs.utk.edu:50070

Two demo screenshots are shown in the following:

![hadoop-50030]({{site.url}}/images/hadoop-50030.png)

![hadoop-50070]({{site.url}}/images/hadoop-50070.png)

## Validate the Cluster by Sample Application

By default, Hadoop-1.2.1 provides a jar package which contains some default examples of Map/Reduce applications. Therefore, we can use one of those to validate if the whole system is working correctly.

In this example, we use *randomwrite*, which write 10GB data into the HDFS via Map/Reduce framework. You can simply execute the following command to initiate the task.

	$ ./bin/hadoop jar hadoop-examples-1.2.1.jar randomwrite /data/out

Note that the output directory /data/out is in HDFS, not in the any local machine.

If you check the website again, you will see the ongoing job is reflected on the webpage.

![hadoop-randomwrite-50030]({{site.url}}/images/hadoop-randomwrite-50030.png)

Additionally, you can see the progress of this map/reduce task from your terminal windows.

![hadoop-randomwrite-terminal]({{site.url}}/images/hadoop-randomwrite-terminal.png)

## Special Notes

### HDFS Basic Commands

HDFS is a distributed file system and its shell-like commands are close to the typical Linux shell command. The following basic commands are from [the official site][2], which I think is quite useful.

| Commands | Sample Use | Meaning |
| :------: | :--------- | :------ |
| ls | ./bin/hadoop fs -ls | directory list |
| mkdir | ./bin/hadoop fs -mkdir | create a new directory/file |
| mv | ./bin/hadoop fs - mv | move a directory/file |
| rm | ./bin/hadoop fs -rm | remove a directory/file |
| cp | ./bin/hadoop fs -cp | copy a directory/file |
| put | ./bin/hadoop fs -put | copy from local to HDFS |
| get | ./bin/hadoop fs -get | copy from HDFS to local |

[1]: http://www.apache.org/dyn/closer.cgi/hadoop/common/
[2]: http://hadoop.apache.org/docs/r0.18.3/hdfs_shell.html
