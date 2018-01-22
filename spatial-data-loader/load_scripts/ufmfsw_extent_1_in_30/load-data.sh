#!/bin/bash

echo Loading Ufmfsw Extent 1 in 30 into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_extent_1_in_30_bv_bng -overwrite -progress -unsetFid --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO ufmfsw_extent_1in30

echo Finished loading Ufmfsw Extent 1 in 30

exit 0








