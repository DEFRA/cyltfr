#!/bin/bash

echo Exporting Ufmfsw Suitability

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.ufmfsw_suitability_bv_bng > ${LTFRI_GDB_ROOT}ufmfsw_suitability.sql

echo Finished exporting Ufmfsw Suitability
