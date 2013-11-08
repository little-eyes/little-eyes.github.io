---
title: "The First Explore of Ceph"
layout: post
tags: big data, object storage, distributed system
---

> What if we do not use HDFS ...

Recently I was working on a data placement project related to high performance computer. How to effectively maintain the data object among the devices become a very challenge problem in the HPC's big data storage. Then I have a chance to look at an alternative file system or object store [Ceph][1].

The way we investigate the Ceph is to deploy a testbed on Amazon AWS environment. This process is not easy at all, it involves many tricky points during the initial deployment. This article intends to make it easy for you to deploy Ceph inside AWS environment.

## Testbed Pre-deployment

Before we jump into the exact steps, the node types of Ceph worth our attention. Admin-node, MDS, MON, and OSD are the four types of nodes in Ceph. Admin-node is the place you initiate all the deployment commands; and MDS is short for metadata containing all the metadata of the objects; and MON is short for monitor which tracks the system; and OSD is the object storage device which contains the physical data objects. If you are not familiar with Ceph, I would suggest you to read through the following articles.

[http://ceph.com/docs/master/architecture/][2]

Our testbed is very simple, we follow the [standard tutorial][3] to deploy Ceph from the scratch. The only thing different from this tutorial is the environment which in our scenario is Amazon AWS. The sample testbed is shown in the following figure.

![ceph-testbed]({{site.url}}/images/ceph.jpg)

Now we are ready to start deploying Ceph into the Amazon AWS environment.

First, we create 4 instances with Ubuntu Server 12.04.3 LTS 64-bit instance in Amazon AWS. The four instances have the following detail information.

	node-admin:
		Public DNS: ec2-54-204-207-187.compute-1.amazonaws.com
		Private DNS: ip-10-185-54-155.ec2.internal
		Private IP: 10.185.54.155
		Hostname: ip-10-185-54-155

	node-0:
		Public DNS: ec2-50-17-21-155.compute-1.amazonaws.com
		Private DNS: ip-10-185-23-23.ec2.internal
		Private IP: 10.185.23.23
		Hostname: ip-10-185-23-23

	node-1:
		Public DNS: ec2-54-227-102-224.compute-1.amazonaws.com
		Private DNS: ip-10-185-199-213.ec2.internal
		Private IP: 10.185.199.213
		Hostname: ip-10-185-199-213

	node-2:
		Public DNS: ec2-184-73-131-183.compute-1.amazonaws.com
		Private DNS: ip-10-185-65-179.ec2.internal
		Private IP: 10.185.65.179
		Hostname: ip-10-185-65-179

One thing we need to pay attention is the **hostname**, because Ceph heavily relies on the hostname instead of IP address. So figure the hostname of an instance is the most important thing. When you create the instance, you will associate it with a security group and a private key. The security group needs to allows all TCP connections, so you may need to add ``All TCPs'' into your security group's inbound rules.

Next, login to the `node-admin` through the SSH with the following command.

	$ ssh -i ceph-deploy.pem ubuntu@ec2-54-204-207-187.compute-1.amazonaws.com

Due to the private key restriction, you cannot SSH another instance without providing the private key. So you need to copy the private key to the node-admin.

	$ scp -i ceph-deploy.pem ceph-deploy.pem ubuntu@ec2-54-204-207-187.compute-1.amazonaws.com:/home/ubuntu

Then you will see `ceph-deploy.pem` is in the node-admin's home directory.

Because Ceph requires password-less access from `node-admin` to other nodes, we need to copy the public key of `node-admin` to `node-0`, `node-1`, and `node-2`. So we first create the keyring with `ssh-keygen`.

	$ ssh-keygen -t rsa -b 2048

The keyring will be stored in `~/.ssh` directory. Unfortunately, we cannot use `ssh-copy-id` to share the public key directly, because `ssh-copy-id` does not work with private key which prevents us from access the other instance. So we use an alternative way to copy the public key in the following.

	$ cat .ssh/id_rsa.pub | ssh -i ceph-deploy.pem ubuntu@ec2-50-17-21-155.compute-1.amazonaws.com "cat - >> ~/.ssh/authorized_keys2"
	$ cat .ssh/id_rsa.pub | ssh -i ceph-deploy.pem ubuntu@ec2-54-227-102-224.compute-1.amazonaws.com "cat - >> ~/.ssh/authorized_keys2"
	$ cat .ssh/id_rsa.pub | ssh -i ceph-deploy.pem ubuntu@ec2-184-73-131-183.compute-1.amazonaws.com "cat - >> ~/.ssh/authorized_keys2"

After sharing the public key with the other nodes, we can SSH `node-0`, `node-1` and `node-2` directly without any password or secure private key.

Thereafter, we can install **ceph-deploy** package on `node-admin` through the following commands.

	$ wget -q -O- 'https://ceph.com/git/?p=ceph.git;a=blob_plain;f=keys/release.asc' | sudo apt-key add -
	$ echo deb http://ceph.com/debian-dumpling/ $(lsb_release -sc) main | sudo tee /etc/apt/sources.list.d/ceph.list
	$ sudo apt-get update
	$ sudo apt-get install ceph-deploy 

## Deploy the Storage Cluster

On the `node-admin`, we first create a new storage cluster by initially adding a monitor. For example, we add `node-0` into the cluster via the following command.

	$ ceph-deploy new ip-10-185-23-23

Then we need to install ceph on `node-0`, `node-1` and `node-2`.

	$ ceph-deploy install ip-10-185-23-23 ip-10-185-199-213 ip-10-185-65-179

This step could take several minutes to finish, so just be patient. Once it finishes, we need to setup the monitors. In our example, we use `node-0` as the single monitor in the testbed.

	$ ceph-deploy mon create ip-10-185-23-23

Next, we need to gather the keyrings from the monitor.

	$ ceph-deploy gatherkeys ip-10-185-23-23

Till now, Ceph has been installed on every node, and we have created a cluster with one monitor `node-0`. Now we move on to add OSDs into the cluster. As we know, `node-1` and `node-2` are the two OSDs in our testbed. We need to make sure each of them has a clear directory or disk to contain the data objects. Thus we create a directory `/tmp/osd` on each of the instance.

	$ ssh ip-10-185-199-213
	$ sudo mkdir /tmp/osd
	$ exit

	$ ssh ip-10-185-65-179
	$ sudo mkdir /tmp/osd
	$ exit

After we have such a directory reserved for Ceph, then we can prepare the OSDs and activate them.

	$ ceph-deploy osd prepare ip-10-185-199-213:/tmp/osd ip-10-185-65-179:/tmp/osd
	$ ceph-deploy osd activate ip-10-185-199-213:/tmp/osd ip-10-185-65-179:/tmp/osd

Note that this step may jump up several **errors**, you could just ignore them first. By repeating the above two commands again, the error will disappear. Finally, we will add the MDS into the cluster. Here we use `node-0` to hold both MON and MDS. So the command is the following.

	$ ceph-deploy mds create ip-10-185-23-23

To validate whether the storage cluster has been successfully deployed, execute the following command on `node-0`.

	$ sudo ceph -w

If we can see the message saying **HEALTH_OK**, then it means we have succeed. A sample message from our sample cluster is the following.




[1]: http://ceph.com
[2]: http://ceph.com/docs/master/architecture/
[3]: http://ceph.com/docs/master/start/


