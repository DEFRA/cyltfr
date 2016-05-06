\echo 'UFMFSW Extent 1 in 100 - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_extent_1_in_100.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
