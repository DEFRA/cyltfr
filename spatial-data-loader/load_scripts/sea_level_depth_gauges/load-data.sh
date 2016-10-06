#!/bin/bash

echo Loading Sea Level Depth Gauges into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RiverSeaLevelFlow_93${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.sea_level_depth_gauges_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO Sea_Monitoring

echo Finished loading Sea Level Depth Gauges

exit 0





