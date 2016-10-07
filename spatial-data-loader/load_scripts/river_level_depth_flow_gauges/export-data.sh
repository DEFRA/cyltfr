#!/bin/bash

echo Exporting River Level Depth Flow

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.river_level_depth_and_flow_gauges_bv_bng > ${LTFRI_GDB_ROOT}river_level_depth_and_flow_gauges.sql

echo Finished exporting River Level Depth Flow
