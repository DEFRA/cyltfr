#!/bin/bash

mkdir -p log
touch log/load-ltfri-layers.log
exec >> log/load-ltfri-layers.log 2>&1

echo ======================================================================
echo $(date) Loading layers
echo
source ~/.profile

echo $(date) Loading Lead_Local_Flood_Authority layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}Misc${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.lead_local_flood_authority_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Lead_Local_Flood_Authority
echo

echo $(date) Loading Extrainfo layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}Misc${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.extra_info_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Extrainfo
echo

echo $(date) Loading Riv_Level_flow_v2_updated layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RiverSeaLevelFlow_93${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.river_level_depth_and_flow_gauges_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Riv_Level_flow_v2_updated
echo

echo $(date) Loading Sea_Monitoring layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RiverSeaLevelFlow_93${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.sea_level_depth_gauges_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Sea_Monitoring
echo

echo $(date) Loading RoFRS_England_v201504 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoFRS_England_v201504${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rofrs_england_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} RoFRS_England_v201504
echo

echo $(date) Loading Flood_Alert_PSF_20151021 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}TargetAreas${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.flood_alert_area_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Flood_Alert_PSF_20151021
echo

echo $(date) Loading Flood_Warning_PSF_20151021 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}TargetAreas${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.flood_warning_area_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} Flood_Warning_PSF_20151021
echo

echo $(date) Loading RoF_Reservoirs_DEPTH_v20150401 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_depth_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} RoF_Reservoirs_DEPTH_v20150401
echo

echo $(date) Loading RoF_Reservoirs_EXTENT_MVS_v20150401 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_extent_merged_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} RoF_Reservoirs_EXTENT_MVS_v20150401
echo

echo $(date) Loading RoF_Reservoirs_EXTENT_v20150401 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_extent_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} RoF_Reservoirs_EXTENT_v20150401
echo

echo $(date) Loading RoF_Reservoirs_VELOCITY_v20150401 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}RoF_Reservoirs_v20150401${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.rof_reservoir_velocity_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} RoF_Reservoirs_VELOCITY_v20150401
echo

echo $(date) Loading ufmfsw_depth_1in100 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_depth_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} --config SPATIAL_INDEX NO ufmfsw_depth_1in100
echo

echo $(date) Loading ufmfsw_depth_1in1000 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_depth_1_in_1000_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_depth_1in1000
echo

echo $(date) Loading ufmfsw_depth_1in30 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_depth_1_in_30_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_depth_1in30
echo

echo $(date) Loading ufmfsw_extent_1in100 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_extent_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_extent_1in100
echo

echo $(date) Loading ufmfsw_extent_1in1000 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_extent_1_in_1000_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_extent_1in1000
echo

echo $(date) Loading ufmfsw_extent_1in30 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_extent_1_in_30_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_extent_1in30
echo

echo $(date) Loading ufmfsw_fdmv25m_1in100 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_flow_direction_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_fdmv25m_1in100
echo

echo $(date) Loading ufmfsw_fdmv25m_1in1000 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_flow_direction_1_in_1000_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_fdmv25m_1in1000
echo

echo $(date) Loading ufmfsw_fdmv25m_1in30 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_flow_direction_1_in_30_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_fdmv25m_1in30
echo

echo $(date) Loading ufmfsw_velocity_1in100 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_velocity_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_velocity_1in100
echo

echo $(date) Loading ufmfsw_velocity_1in1000 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_velocity_1_in_1000_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_velocity_1in1000
echo

echo $(date) Loading ufmfsw_velocity_1in30 layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Banded_Vector_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_velocity_1_in_30_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} ufmfsw_velocity_1in30
echo

echo $(date) Loading uFMfSW_Suitability_National layer
ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=${LTFRI_DB_HOST} port=${LTFRI_DB_PORT} dbname=${LTFRI_DB_NAME} user=${LTFRI_DB_USER} password=${LTFRI_DB_PASSWORD}" ${LTFRI_GDB_ROOT}uFMfSW_Suitability_National${LTFRI_GDB_POSTFIX}.gdb -nln ${LTFRI_DB_SCHEMA}.ufmfsw_suitability_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_INDEX=${LTFRI_GENERATE_SPATIAL_INDEX} uFMfSW_Suitability_Merged

echo
echo $(date) Loaded layers
echo ======================================================================
