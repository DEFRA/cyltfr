#!/bin/bash

echo copying data from S3 repository

s3cmd sync --delete-removed s3://ltfri/RoF_Reservoirs_v20150401.gdb/ ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401.gdb/

echo Loading Rof Reservoir Extent into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_extent_merged_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO RoF_Reservoirs_EXTENT_MVS_v20150401

echo Rof Reservoir Extent connecting to database

psql "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -f run.sql -X --echo-queries --set ON_ERROR_STOP=on -w 

echo Finished loading Rof Reservoir Extent

exit 0






