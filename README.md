…or create a new repository on the command line
echo "# pickmaster-3000" >> README.md
git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/EnderMaldonado/pickmaster-3000.git
git push -u origin master
…or push an existing repository from the command line

git remote add origin https://github.com/EnderMaldonado/pickmaster-3000.git
git commit -m "Add existing file"
git push -u origin master

…or import code from another repository
You can initialize this repository with code from a Subversion, Mercurial, or TFS project.


reate a new repository on GitHub. You can also add a gitignore file, a readme and a licence if you want
 Open Git Bash
Change the current working directory to your local project.
Initialize the local directory as a Git repository.
git init
Add the files in your new local repository. This stages them for the first commit.
git add .
 Commit the files that you’ve staged in your local repository.
git commit -m "initial commit"
 Copy the https url of your newly created repo
In the Command prompt, add the URL for the remote repository where your local repository will be pushed.

git remote add origin remote repository URL

git remote -v
 Push the changes in your local repository to GitHub.

git push -f origin master


heroku logs --tail
