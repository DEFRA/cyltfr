# Instructions for loading long term flood risk spatial data subset into development and test environments

# Overview

## Prerequisites

### Gdal must be installed

sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update

sudo apt-get install gdal-bin

### Enable use of module specific environment variables. Add the following line to .profile
source $HOME/ltfri/spatial-data-loader/scripts/load_scripts/ltfri/etc/.profile

Source ~/.profile or logout/login or reboot for .profile changes to take effect

### For each dataset that you wish to load:

#### Load the data

cd into corresponding load_scripts folder

execute the shell script, will often take several hours to run

./load-data.sh

#### Clean the data

execute the shell script

./clean-data.sh

#### Export the data

execute the shell script

./export-data.sh

#### Zip the exported .sql files(s) and copy to s3://ltfri/data-updates directory

### Ensure that the tile cache is regenerated. Log into Geoserver web admin site
Click on Tile Layers. Click on Seed/Truncate adjacent option adjacent to layer. 
Number of tasks to use: 8
Type of operation: Reseed - regenerate all tiles
Grid Set: EPSG:27700
Format: image/png
Zoom start: 00
Zoom stop: 07
Click Submit Button
Check Geoserver Logs for errors. Surface water data may error - if so create in batches e.g
Zoom level 00 - 02, 03 - 04 ... 6-7

### To load data into test environment 
click on FR_TEST tab and run corresponding FR_TEST_99_.. job

### Run aws S3 sync job (can be run from dev server)
aws s3 sync S3://flood-risk-dev//<Layer cache name>/ --delete

### Data should now be ready to test

# Detailed steps

## Load geodatabase onto development database server
1.	Receive File Geodatabase (.gdb) as a zip file from DMMI via ShareFile link.
2.	Log into OpenVPN.
3.	Use Jenkins to power up FR_DEV development environment.
4.	Run PGAgent and add LTFRI keys.
5.	Upload .gdb to development Bastion Server using WinSCP or similar.
6.	Using putty connect to development Bastion server.
7.	SFTP to the development database server.
8.	Put the .zip file into the /home/ubuntu/data/ltfri/ directory.

## Load new data into development database
9.	SSH to the development database server.
10.	cd to the /home/ubuntu/data/ltfri/ directory and extract the .zip file.
11.	cd to the /home/ubuntu/load_scripts/ directory.
12.	cd to the directory that contains the scripts for the .gdb that you want to load.
13.	Using Vi edit the load-data.sh script to make sure the name of the .gdb file is correct.
	Also in load-data.sh check that the layer name is correct at the end of the ogr2ogr command.
14.	Execute the load-data.sh script.
15.	Execute the clean-data.sh script.

## Export clean data from development database to .sql file and load to S3
16.	Execute the export-data.sh script. This exports a .sql file to the /home/Ubuntu/data/ltfri/ directory.
17.	Exit the development database server.
18.	From the development Bastion server, SFTP to the development database server.
19.	Get the .sql file, copy it to a local folder.
20.	Zip the .sql file, keep the same prefix as the .sql file.
21.	Using an S3 browser upload the .zip file to the ltfri/data-updates folder.

## Delete existing Geoserver cache from development folder (River and Sea or Reservoirs only)
22.	Using a browser connect to the Geoserver Admin page.
23.	Click on Tile Layers.
24.	Click on the Empty button next to the required dataset.
25.	When the Geoserver task completes, check the S3 cache bucket. Using an S3 browser go to flood-risk-dev and check that the corresponding folder it empty.
26.	Tiles can be for layers can be found in Folders ending with:
		Rofrs_england_bv_bng (ROFRS): 7fd9
		Rof_reservoir_extent_merged_bv_bng (ROFR): 7fd1
		Rof_reservoir_depth_bv_bng (DOFR): 7fd0
		Rof_reservoir_velocity_bv_bng (SOFR): 7fcc

## Re-seed the Geoserver cache in development environment (River and Sea or Reservoirs only)
27.	Back on the Geoserver Admin page. Click on seed/truncate next to the layer required.
28.	Number of tasks to use: 08
29.	Reseed – generate missing tiles
30.	Zoom start: 00
31.	Zoom stop: 07
32.	Submit

## Load the data into the test database using Jenkins
33.	Open the Jenkins admin page in a browser
34.	Click on the FR_TEST tab
35.	Execute the Jenkins task for the corresponding dataset:
		FR_TEST_99_LOAD_ROFRS_ENGLAND
		FR_TEST_99_LOAD_RESERVOIRS
		FR_TEST_99_LOAD_TARGET_AREAS

# Clone Geoserver cache from development environment to test
36.	When Geoserver caching has finished running on the development server, clone the development Geoserver cache in the Test environment.
37.	Using putty connect to Dev Bastion server.
38.	SSH to the development database server.
39.	Run the command:
		/usr/local/bin/aws s3 sync s3://flood-risk-dev//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd9/ s3://flood-risk-test//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd9/ --delete
	*Swap LayerGroupInfoImpl for the name of the S3 tile cache that you need to update.*

# Check data in test environment
40.	Test that the new version of the dataset is visible in the test LTFRI application.



