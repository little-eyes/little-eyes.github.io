title: "Switch to Hexo - Pros and Cons"
layout: post
tags:
- hexo
- platform
category:
- technology
date: 2014/12/19
---

I have been using Jekyll as my blog platform for almost two years, which provides me great experience with bloging and host on Github. Till recently, I encounter a situation to extend my blog into multiple category requiring me write a small plugin to Jekyll. Unfortunately, Github does not allow you to push your plugin to the `master` branch and run directly. Then I have to branch out a `source` branch and deploy static files to the `master` branch. The whole process could be as complicated as my [previous blog][1].

<!-- more -->

Therefore, I start searching new platforms again. Not many candidates fall into the consideration, but **Hexo** is one which is powered up by `Node.js` (one of my favorite server-side platform). Then a question come to my mind: does Github host Node.js app?

Apparently not. Github only play with static files and Jekyll. Fortunately, Hexo is a good platform that compiles the static files for you. So you develop as if you are working on the Node.js project, but deploy as static files to Github. This satisfies all my needs here. So I started migrate. Surprisingly easy, a few commands can setup the development environment and move all the content to Hexo. Just follow [the documentation][2], you will get there.

There are a couple of benefits you could get from Hexo for free: `deployment` and `theme`. I like the deployment story of Hexo because it is just three commands to deploy your Github pages. So I don't have to write my own script to manipulate Git and push to the `master` branch. By the way, it also support other service like: `Heroku`, `Rsync`, `OpenShift` and `Generic Git`. These covers the major blog hosting services and also provides you to host on any machine or cloud service using Git.

```sh
$ hexo clean
$ hexo generate
$ hexo deploy
```

When I use Jekyll, I cook my themes by myself which could be good or bad. I can easily create a blog with minimal design and make it looks not bad. So I spent a little more time than expected working on the themes and make it pretty. This is something I really don't want to see because I believe I should contribute content when I write my blog not the UX. Using Hexo, things become much easy. You can take a look at different themes in the [official website][3], then pick one with a simple Git clone command like the following.

```sh
$ git clone git://github.com/heroicyang/hexo-theme-modernist.git themes/modernist
```

If you want to tweak the appearance a little bit, then 10 to 30 minutes should be enough to play with theme a little. Since Hexo uses `Jade` to generate CSS, so it makes a lot easier to tweak the page. However, if you want to make a major surgery on your theme, you might have to spend a lot of time unless you are very faimilar with the architecture of the theme. It took me a lot of time to figure out where to add Disqus and make it work because some themes does not support Disqus by default. But it always a good practice to understand more about the platform.

> Hack and have fun!

[1]: http://jilongliao.com/2014/10/12/Jekyll-with-Multi-collection-Blog/
[2]: http://hexo.io/docs/
[3]: https://github.com/hexojs/hexo/wiki/Themes
