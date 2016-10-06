#!/bin/bash

echo Loading Ufmfsw Flow Direction 1 in 1000 into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_flow_direction_1_in_1000_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO ufmfsw_fdmv25m_1in1000

echo Finished loading Ufmfsw Flow Direction 1 in 1000

exit 0








