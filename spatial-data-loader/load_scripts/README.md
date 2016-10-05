# Instructions for loading long term flood risk spatial data subset.

# Install gdal 1.11 to allow file geodatabases to be read.  Ubuntu 14.04 software repositories only
# provide access to gdal 1.10 so gdal 1.11 has to be compiled from source.  For convenience,
# the Amazon S3 ltfri bucket contains a gdal 1.11 debian package created by compiling gdal 1.11 from
# source with use of checkinstall.
sudo dpkg -i <<path to gdal_1.11.3-1_amd64.deb>>/gdal_1.11.3-1_amd64.deb

# Check that gdal 1.11 installed correctly (the output of the followinbg command should include -> "OpenFileGDB" (readonly))
ogrinfo --formats

# Enable use of module specific environment variables
# Add the following line to .profile
source $HOME/ltfri/spatial-data-loader/scripts/load_scripts/ltfri/etc/.profile

# Source ~/.profile or logout/login or reboot for .profile changes to take effect

# Copy the long term flood risk subset layers to the ltfri Amazon S3 bucket

# For each dataset that you wish to load
# cd into corresponding load_scripts folder
# execute the shell script, will often take several hours to run
# will copy data from s3 bucket to local data folder and then load/clean in database

./load-data.sh

# Ensure that the tile cache is regenerated. Log into Geoserver web admin site
# Click on Tile Layers. Click on Seed/Truncate adjacent option adjacent to layer. 
# Number of tasks to use: 8
# Type of operation: Reseed - regenerate all tiles
# Grid Set: EPSG:27700
# Format: image/png
# Zoom start: 00
# Zoom stop: 07
# Click Submit Button
# Check Geoserver Logs for errors. Surface water data may error - if so create in batches e.g
# Zoom level 00 - 02, 03 - 04 ... 6-7

# If data needs to be exported from development database
# Export using PGAdmin. Right click on table to export. 
# Choose Backup, enter a filename, select data only and ignore tablespace. 






