\echo 'River Level Depth and Flow Gauges - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/river_level_depth_and_flow_gauges.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.river_level_depth_and_flow_gauges_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
