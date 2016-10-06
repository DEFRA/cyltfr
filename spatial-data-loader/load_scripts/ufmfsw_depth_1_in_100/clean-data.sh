#!/bin/bash

echo Ufmfsw Depth 1 in 100 running database scripts

psql "user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD} host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME}" -f run.sql -X --echo-queries --set ON_ERROR_STOP=on -w 

echo Ufmfsw Depth 1 in 100 finished running database scripts

exit 0
