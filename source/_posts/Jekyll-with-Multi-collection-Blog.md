title: "Jekyll with Multi-collection Blog"
layout: post
tags:
  - jekyll
  - git
category:
  - technology
date: 2014/10/12
---

When we host our blogs on Github, I guess most of us use Jekyll. Before I realize I need a different collection of blogs, I always start with a single collection or category as everybody does. However, I have to face a problem that to make multiple categories of blog into different URLs under the same domain. For example,

> http://jilongliao.com/technology

> http://jilongliao.com/journey

I searched the web for a little while and figure out this could be easily solved, but also a little challenging when handle some tricky cases with Github policies (we will get there later). Jekyll does a very good job for you to make your blog multi-categories. Simply put a new directory under your Jekyll site root directory would work. Inside that directory it needs to contains an `index.html` file and `_posts` folder. The `_posts` folder is the place you can put all your post belonging to this category in the future. After that, you will have a directory structure like the following.

<!-- more -->

```
+ MySite
  - index.html
+ css/
+ js/
+ _posts/
+ _layouts/
+ Your new collection
  - index.html
+ _posts/
  - A.md
  - B.md
```

This would make your site's URL functioning well, however, it lacks of the ability to filter your blogs. To address this issue, I use the `category` keyword as the collection separator inside the markdown file. So you might want to add the category information in each of your blog. For instance,

```markdown
---
title: "Jekyll with Multi-collections"
layout: post
tags: jekyll, git
category: technology
---
```

To filter out the different category, you can write whatever ruby code you feel comfortable. I found [Adam's code][1] is very clean and well designed, which I could borrow for this purpose in my site. For convenience purpose, I put the code as bellow. You save this code to your `_plugins` folder.

```ruby
module Jekyll
  class WithinCategoryPostNavigation < Generator
    def generate(site)
      site.categories.each_pair do |category, posts|
        posts.sort! { |a,b| b <=> a}
        posts.each do |post|
          index = posts.index post
          next_in_category = nil
          previous_in_category = nil
          if index
            if index < posts.length - 1
              next_in_category = posts[index + 1]
            end
            if index > 0
              previous_in_category = posts[index - 1]
            end
          end
          post.data["next_in_category"] = next_in_category unless next_in_category.nil?
          post.data["previous_in_category"] = previous_in_category unless previous_in_category.nil?
        end
      end
    end
  end
end
```

Use this Jekyll plugin is very simple, because it makes all the blog a dictionary which indexed by the `category`. As an example, the code is blow.

```javascript
<script language="javascript">
window.location.href = "{ { site.categories['technology'].first.url } }"
</script>
```

After you finish this, you can test it perfectly locally. However when you publish the site to Github, the site will fail to build because the Github does not allow customized plugin in their build system. So we have to hack this a little.

An interesting compromise Github provides is that you can push your `_site` directly to the `master` branch where you can play any plugins as you want. So instead of maintain the code in the `master` branch, I switch it to `source` branch but use `master` branch to push `_site`. This is a little complicated because you need to manipulate the repository between remote and local back-and-forth. So I prepare a bash script that could easily do this job.

```sh
cleanup() {
  echo -e '\e[1;32mSwitch to source branch ...\e[0m'
  git checkout source

  echo -e '\e[1;32mDelete master branch ...\e[0m'
  git branch -D master

  echo -e '\e[1;32mPull and merge remote/source branch ...\e[0m'
  git pull origin source
}

echo -e '\e[1;32mStart deploying ...\e[0m'

echo -e '\e[1;32mClean up remote/master branch ...\e[0m'
git push origin :master || cleanup

echo -e '\e[1;32mCreate local/master branch ...\e[0m'
git branch master

echo -e '\e[1;32mSwitch to master branch ...\e[0m'
git checkout master

echo -e '\e[1;32mBuild the site ...\e[0m'
jekyll build

echo -e '\e[1;32mRe-map site directory to the root ...\e[0m'
git filter-branch --subdirectory-filter _site -- --all
mv _site/* .
rm -r _site

echo -e '\e[1;32mCommit changes to Git ...\e[0m'
git add *
git commit -am "deploy"

echo -e '\e[1;32mPush to Github and deploy ...\e[0m'
git push origin master || cleanup

cleanup
```

so you run this script in bash shell should do the job automatically. Of course, you site will be down for a little while, but it should be back in a few seconds.

[1]: http://ajclarkson.co.uk/blog/jekyll-category-post-navigation/
