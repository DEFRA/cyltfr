#!/bin/bash

echo processing rof reservoir depth

cd /home/geost/ltfri/spatial-data-loader/load_scripts/rof_reservoir_depth

./load-data.sh

./clean-data.sh

./export-data.sh

echo processing rof reservoir extent

cd /home/geost/ltfri/spatial-data-loader/load_scripts/rof_reservoir_extent

./load-data.sh

./clean-data.sh

./export-data.sh

echo processing rof reservoir extent_merged

cd /home/geost/ltfri/spatial-data-loader/load_scripts/rof_reservoir_extent_merged

./load-data.sh

./clean-data.sh

./export-data.sh

echo processing rof reservoir velocity

cd /home/geost/ltfri/spatial-data-loader/load_scripts/rof_reservoir_velocity

./load-data.sh

./clean-data.sh

./export-data.sh

echo creating zipfile

cd /home/geost/data/ltfri

zip rof_reservoir.zip rof_reservoir_depth.sql rof_reservoir_extent.sql rof_reservoir_extent_merged.sql rof_reservoir_velocity.sql

echo finished processing rof reservoir data. Zip file will be in ${LTFRI_GDB_ROOT} directory


