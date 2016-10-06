#!/bin/bash

echo Loading Ufmfsw Extent 1 in 100 into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_extent_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO ufmfsw_extent_1in100

echo Finished loading Ufmfsw Extent 1 in 100

exit 0








