\echo 'ROFRS England - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rofrs_england.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rofrs_england_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
