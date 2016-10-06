#!/bin/bash

echo Loading flood warning areas into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}TargetAreas${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.flood_warning_area_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO Flood_Warning_PSF

echo Finished loading Flood Warning Areas

exit 0






