#!/bin/bash

echo copying data from S3 repository

s3cmd sync --delete-removed s3://ltfri/TargetAreas.gdb/ ${LTFRI_GDB_ROOT}TargetAreas.gdb/

echo Loading Flood Alert Areas into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}TargetAreas${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.flood_alert_area_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO Flood_Alert_PSF_20151021

echo Flood Alert Areas running database scripts

psql "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -f run.sql -X --echo-queries --set ON_ERROR_STOP=on -w 

echo Finished loading Flood Alert Areas

exit 0








