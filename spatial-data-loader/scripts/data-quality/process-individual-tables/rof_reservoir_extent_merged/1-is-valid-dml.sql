\echo 'ROF Reservoir Extent Merged - IsValid'

\o /home/ubuntu/ltfri/spatial-data-loader/reports/rof_reservoir_extent_merged.txt

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_extent_merged_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o