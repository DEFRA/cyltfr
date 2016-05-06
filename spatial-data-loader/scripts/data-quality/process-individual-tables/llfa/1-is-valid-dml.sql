\echo 'Lead Local Flood Authorities - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/lead_local_authority.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.lead_local_flood_authority_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
