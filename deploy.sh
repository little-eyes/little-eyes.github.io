echo -e '\e[1;32mStart deploying ...\e[0m'

echo -e '\e[1;32mClean up remote/master branch ...\e[0m'
git push origin :master

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
git push origin master

echo -e '\e[1;32mSwitch to source branch ...\e[0m'
git checkout source

echo -e '\e[1;32mDelete master branch ...\e[0m'
git branch -D master

echo -e '\e[1;32mPull and merge remote/source branch ...\e[0m'
git pull origin source 
