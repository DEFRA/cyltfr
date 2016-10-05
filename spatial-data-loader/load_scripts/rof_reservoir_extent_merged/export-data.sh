#!/bin/bash

echo Exporting Rof Reservoir Extent Merged

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --column-inserts -t ${LTFRI_DB_SCHEMA}.rof_reservoir_extent_merged_bv_bng > ${LTFRI_GDB_ROOT}rof_reservoir_extent_merged.sql

echo Finished exporting Rof Reservoir Extent Merged
