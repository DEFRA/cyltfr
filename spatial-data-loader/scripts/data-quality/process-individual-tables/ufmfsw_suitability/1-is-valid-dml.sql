\echo 'UFMFSW Suitability - IsValid'

\o D:/projects/ltfri/exports/dataQuality/reports/ufmfsw_suitability.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_suitability_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
