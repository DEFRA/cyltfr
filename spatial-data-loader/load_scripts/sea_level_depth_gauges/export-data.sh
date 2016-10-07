#!/bin/bash

echo Exporting Sea Level Depth Gauges

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.sea_level_depth_gauges_bv_bng > ${LTFRI_GDB_ROOT}sea_level_depth_gauges.sql

echo Finished exporting Sea Level Depth Gauges
