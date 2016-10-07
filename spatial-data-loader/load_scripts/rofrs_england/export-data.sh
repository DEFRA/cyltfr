#!/bin/bash

echo Exporting ROFRS England

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --inserts -t ${LTFRI_DB_SCHEMA}.rofrs_england_bv_bng > ${LTFRI_GDB_ROOT}rofrs_england.sql

echo Finished exporting ROFRS England
