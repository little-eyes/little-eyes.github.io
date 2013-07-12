---
title: All jekyll, no hyde
layout: post
tags: blog jekyll oss
---
I'm not a blogger. Odd coming from someone who is writing those words on
the very thing that he professes that he does not use. It's true. At least
it was, until I discovered [Jekyll](http://jekyllrb.com) + Github.

Jekyll is a static website generator written in ruby that is open source
and blog aware. It scans your [Markdown](http://daringfireball.net/projects/markdown/syntax)
files (you can use HTML as well) and constructs CSS-wrapped static HTML files.
It uses the awesome [Liquid](https://github.com/shopify/liquid/) templating engine to
do all kinds of cool stuff (take a gander at the source of my 
[archive page](https://github.com/tamaslnagy/tamaslnagy.github.io/blob/master/archive.html) for a real world example).

You can install Jekyll locally and have it track your
changes and auto-generate your website whenever you make modifications. Just run the
following code and navigate to `localhost:4000` with your favorite browser to try it
out:

    jekyll serve -w

If that wasn't awesome enough, Github lets you host your Jekyll blog for free. Most
likely you are already using git for versioning anyway, why not use it to 
deploy as well? All it takes is a simple 

    git push 

to deploy the latest version. The best part? You own your data. All of your
posts sit in a `_posts/` directory on your computer, not in some CMS somewhere.

Plus, static sites are sweet:

 - Fast
 - Low bandwidth
 - Easy
 - Fully customizable

Additionally, there is something profounding satisfying about building and
sculpting your very own system that you do not get if you are
using any generic blogging service (blogger and the like). I had that
experience with Jekyll and it might be enough to get me into blogging, 
something that I have never really experimented with in the past.
