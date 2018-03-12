#!/bin/bash

echo processing target area data

cd /home/geost/ltfri/spatial-data-loader/load_scripts/flood_alert_areas

pwd

./load-data.sh

./clean-data.sh

./export-data.sh

cd /home/geost/ltfri/spatial-data-loader/load_scripts/flood_warning_areas

./load-data.sh

./clean-data.sh

./export-data.sh

cd /home/geost/data/ltfri

zip target_area.zip flood_alert_area.sql flood_warning_area.sql

echo finished processing target area data. Zip file will be in ${LTFRI_GDB_ROOT} directory


