\echo 'UFMFSW Depth 1 in 1000 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_depth_1_in_1000.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
