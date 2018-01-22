#!/bin/bash

echo Loading Ufmfsw Suitability into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Suitability_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_suitability_bv_bng -overwrite -progress -unsetFid --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO uFMfSW_Suitability_Merged

echo Finished loading Ufmfsw Suitability

exit 0








