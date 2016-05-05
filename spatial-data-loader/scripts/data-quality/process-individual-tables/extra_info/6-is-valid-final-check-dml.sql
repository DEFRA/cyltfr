\echo 'Extra Info - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/extra_info.txt 

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.extra_info_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
