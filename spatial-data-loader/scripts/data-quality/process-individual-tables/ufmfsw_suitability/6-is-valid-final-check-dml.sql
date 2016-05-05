\echo 'UFMFSW Suitability - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/ufmfsw_suitability.txt

SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_suitability_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
