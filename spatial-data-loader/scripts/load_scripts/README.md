# Instructions for loading long term flood risk spatial data subset.

# TO DO - Review and refactor before publishing as open source.

# Install gdal 1.11 to allow file geodatabases to be read.  Ubuntu 14.04 software repositories only
# provide access to gdal 1.10 so gdal 1.11 has to be compiled from source.  For convenience,
# the Amazon S3 ltfri bucket contains a gdal 1.11 debian package created by compiling gdal 1.11 from
# source with use of checkinstall.
sudo dpkg -i <<path to gdal_1.11.3-1_amd64.deb>>/gdal_1.11.3-1_amd64.deb

# Check that gdal 1.11 installed correctly (the output of the followinbg command should include -> "OpenFileGDB" (readonly))
ogrinfo --formats

# Enable use of module specific environment variables
# Add the following line to .profile
source $HOME/ltfri/spatial-data-loader/etc/.profile

# Source ~/.profile or logout/login or reboot for .profile changes to take effect

# Copy the long term flood risk subset layers to the location specified by
# the environment variable LTFRI_GDB_ROOT in $HOME/ltfri/spatial-data-loader/etc/.profile

# for each dataset that you wish to load
# cd into corresponding load_scripts folder
# exceute the shell script, will often take several hours to run
# will copy data from s3 bucket to local data folder and then load/clean in database

./load-data.sh

