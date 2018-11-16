#!/bin/bash

echo Loading ROFRS England into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoFRS_v201812.gdb -nln ${LTFRI_DB_SCHEMA}.rofrs_england_bv_bng -overwrite -progress -unsetFid --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO RoFRS_v201812

echo Finished loading ROFRS England

exit 0





