# Allow group write access to the initial contents of the geoserver data directory
sudo /bin/chmod -R ug+w ${HOME}/ltfri/geoserver/data
# Copy post-check and post-merge to the directory <<Git local repository>>/.git/hooks
cd ~/ltfri/.git/hooks
cp ~/ltfri/git-hooks/post-checkout .
cp ~/ltfri/git-hooks/post-merge .
# Copy 01-sudoers to /etc/sudoers.d
cd /etc/sudoers.d
sudo cp ~/ltfri/git-hooks/01-sudoers .
