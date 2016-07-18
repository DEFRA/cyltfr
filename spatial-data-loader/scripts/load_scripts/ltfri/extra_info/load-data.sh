#!/bin/bash

echo copying data from S3 repository

s3cmd sync --delete-removed s3://ltfri/Misc.gdb/ ${LTFRI_GDB_ROOT}Misc.gdb/

echo Loading Extra Info layer

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}Misc${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.extra_info_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO Extrainfo

echo Extra Info running database scripts

psql "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -f run.sql -X --echo-queries --set ON_ERROR_STOP=on -w 

echo Finished loading Extra Info

exit 0






