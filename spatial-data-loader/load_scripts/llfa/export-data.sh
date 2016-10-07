#!/bin/bash

echo Exporting llfa

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.lead_local_flood_authority_bv_bng > ${LTFRI_GDB_ROOT}lead_local_flood_authority.sql

echo Finished exporting llfa
