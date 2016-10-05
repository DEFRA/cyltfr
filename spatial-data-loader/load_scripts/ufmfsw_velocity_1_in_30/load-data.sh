#!/bin/bash

echo copying data from S3 repository

s3cmd sync --delete-removed s3://ltfri/uFMfSW_Banded_Vector_National.gdb/ ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National.gdb/

echo Loading Ufmfsw Velocity 1 in 30 into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_velocity_1_in_30_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO ufmfsw_velocity_1in30

echo Ufmfsw Velocity 1 in 30 running database scripts

psql "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -f run.sql -X --echo-queries --set ON_ERROR_STOP=on -w 

echo Finished loading Ufmfsw Velocity 1 in 30

exit 0








