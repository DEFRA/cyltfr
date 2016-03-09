-- USE ST_MakeValid function to repair spatial data errors present in some tables

\echo 'Extra Info - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/extra_info.txt 

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.extra_info_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'Flood Alert Areas - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/flood_alert_area.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.flood_alert_area_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'Flood Warning Areas - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/flood_warning_area.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.flood_warning_area_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'Lead Local Flood Authorities - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/lead_local_authority.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.lead_local_flood_authority_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'River Level Depth and Flow Gauges - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/river_level_depth_and_flow_gauges.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.river_level_depth_and_flow_gauges_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'ROF Reservoir Depth - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rof_reservoir_depth.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_depth_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'ROF Reservoir Extent - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rof_reservoir_extent.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_extent_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'ROF Reservoir Extent Merged - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rof_reservoir_extent_merged.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_extent_merged_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'ROF Reservoir Velocity - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rof_reservoir_velocity.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_velocity_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'ROFRS England - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rofrs_england.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rofrs_england_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'Sea Level Depth Gauges - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/sea_leveL_depth_gauges.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.sea_level_depth_gauges_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Depth 1 in 1000 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_depth_1_in_1000.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Depth 1 in 100 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_depth_1_in_100.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Depth 1 in 30 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_depth_1_in_30.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Extent 1 in 1000 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_extent_1_in_1000.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Extent 1 in 100 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_extent_1_in_100.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Extent 1 in 30 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_extent_1_in_30.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Flow Direction 1 in 1000 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_flow_direction_1_in_1000.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Flow Direction 1 in 100 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_flow_direction_1_in_100.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Flow Direction 1 in 30 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_flow_direction_1_in_30.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Suitability - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_suitability.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_suitability_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Velocity 1 in 1000 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_velocity_1_in_1000.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Velocity 1 in 100 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_velocity_1_in_100.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\echo 'UFMFSW Velocity 1 in 30 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_velocity_1_in_30.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
