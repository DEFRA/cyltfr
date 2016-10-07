#!/bin/bash

echo Exporting Ufmfsw Velocity 1 in 30

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.ufmfsw_velocity_1_in_30_bv_bng > ${LTFRI_GDB_ROOT}ufmfsw_velocity_1_in_30.sql

echo Finished exporting Ufmfsw Velocity 1 in 30
