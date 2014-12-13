title: "A Practice on Amazon EC2 (Ubuntu 11.10 Server) with LAMP Server and SVN Server"
layout: post
tags:
  - Amazon EC2
  - LAMP
  - Linux
  - SVN
category:
  - technology
date: 2012/1/22
---

Amazon EC2 provides a decent solution to highly scalable server and large data set processing. This little blog talks about the very beginning steps to make an Amazon EC2 server instance running with LAMP and SVN services. I will make it concise and expressive.

<!-- more -->

### Step 1

Of course! Sign up those whole bunch of services like Amazon EC2, S3...Well, you can definitely do it in [this webpage][1]. Then, you need to create an instance. Here I choose Ubuntu 11.10 Server 32-bit edition (for image ID, please refer to [this page][2]). For **HOWTO** create an instance, you can either google it, pretty simple. But please remember to keep the key associated with the instance well.

### Step 2

When your instance is ready to use, we will use SSH to login. Since the design choice requires the key is kept not so public that you'd better to change rights for the key file. In Ubuntu, try the following command in your Terminal:

```
$ sudo chmod 400 amazon-ec2.pem
```

After you get it done, you can login to your Amazon EC2 instance via the public DNS. Suppose you have the DNS: _c2-192-168-10-90.compute-1.amazonaws.com_.

Then you can login the instance with your key.

```
$ ssh -i amazon-ec2.pem ubuntu@ec2-192-168-10-90.compute-1.amazonaws.com
```

Basically, you should use `ubuntu` as the user name when login.

### Step 3

Once you login, things become easy as you do your local Ubuntu Server. Apparently, you need the following software.

```
$ sudo apt-get install lamp-server^
$ sudo apt-get install phpmyadmin
```

This two command line will guide you to setup your LAMP stack. Then try the URL: _http://ec2-192-168-10-90.compute-1.amazonaws.com_, which will show "It Works!!".

However, this is not end for using phpmyadmin. You need a very small configuration to make it work, though sometime it works without doing anything. If you install those two packages, the Apache2 configuration file is in **/etc/apache2/apache2.conf**; the phpmyadmin configuration file is in **/etc/phpmyadmin/apache.conf**. So add the following line to Apache2 configuration file:

```
Include /etc/phpmyadmin/apache.conf
```

Now the phpmyadmin should work correctly, you may verify via the URL: _http://ec2-192-168-10-90.compute-1.amazonaws.com/phpmyadmin_. If you failed, you'd better to read [this article][3].


### Step 4

Install the Subversion.

```
$ sudo apt-get install subversion
$ sudo apt-get install libapache2-svn
```

### Step 5

Config the SVN server. Suppose you want the following URL as your SVN repository: _http://ec2-192-168-10-90.compute-1.amazonaws.com/repos/your-project-here_.

First, you need two directories in the **/var/www**. One is **/var/www/svn** where you create your svn repository, the other is **/var/www/svn-auth** where stores users' password. The /var/www/svn should belongs to **www-data** and have a more public rights. Run the command:

```
$ sudo chown -R www-data.www-data /var/www/svn
```

Second, you must modify the /etc/apache2/sites-avaliable/default:

```
$ sudo vim /etc/apache2/sites-available/default
```

Then add the following to the file:

```
<Location /repos>
  DAV svn
  SVNParentPath /var/www/svn
  AuthType Basic
  AuthName "Subversion"
  AuthUserFile /var/www/svn-auth/passwd
  Require valid-user
</Location>
```

**ATTENTION: the red label part should be consistent, or you will be failed to find the correct URL.**

Finally, restart the Apache server by using the following command:

```
$ sudo service apache2 restart
```

Now the configuration should be OK!

### Step 6

Create user name and password. Use the following command:

If it is the first time:

```
$ sudo htpasswd -cb /var/www/svn-auth/passwd user-name passwd
```

Or not:

```
$ sudo htpasswd -b /var/www/svn-auth/passwd user-name passwd
```

Run more times if multiple user needed.

### Step 7

Create a test repository and start the SVN service.

```
$ cd /var/www/svn
$ sudo svnadmin create test
$ sudo chmod 777 -R /var/www/svn
```

Now the "test" project's repository is ready to use! Don't forget to chmod /var/www/svn every time you add a new repository, otherwise someone may not be able to commit.

[1]: http://aws.amazon.com
[2]: http://cloud-images.ubuntu.com/releases/11.10/release/
[3]: https://help.ubuntu.com/community/phpMyAdmin
