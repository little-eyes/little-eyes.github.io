echo 'Start deploying ...'

echo 'Clean up remote/master branch ...'
git branch -D master

echo 'Create local/master branch ...'
git branch master

echo 'Switch to master branch ...'
git checkout master

echo 'Build the site ...'
jekyll build

echo 'Re-map site directory to the root ...'
git filter-branch --subdirectory-filter _site -- --all
mv _site/* .
rm -r _site

echo 'Commit changes to Git ...'
git add *
git commit -am "deploy"

echo 'Push to Github and deploy ...'
git push origin master

echo 'Switch to source branch ...'
git checkout source

echo 'Delete master branch ...'
git branch -D msater 
