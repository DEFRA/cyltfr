#!/bin/bash

echo Exporting flood_alert_areas

pg_dump "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -a --column-inserts -t ${LTFRI_DB_SCHEMA}.flood_alert_area_bv_bng > ${LTFRI_GDB_ROOT}flood_alert_area.sql

echo Finished exporting flood_alert_areas
