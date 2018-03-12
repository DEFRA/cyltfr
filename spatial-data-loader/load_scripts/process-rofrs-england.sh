#!/bin/bash

echo processing rofrs_england data

cd /home/geost/ltfri/spatial-data-loader/load_scripts/rofrs_england

pwd

./load-data.sh

./clean-data.sh

./export-data.sh

cd /home/geost/data/ltfri

zip rofrs_england.zip rofrs_england.sql

echo finished processing rofrs_england data. Zip file will be in ${LTFRI_GDB_ROOT} directory


