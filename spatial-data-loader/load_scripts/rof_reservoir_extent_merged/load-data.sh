#!/bin/bash

echo Loading Rof Reservoir Extent Merged into database

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_extent_merged_bv_bng -overwrite -progress -unsetFid --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO RoF_Reservoirs_EXTENT_MVS${LTFRI_GDB_POSTFIX}

echo Finished loading Rof Reservoir Extent Merged

exit 0




