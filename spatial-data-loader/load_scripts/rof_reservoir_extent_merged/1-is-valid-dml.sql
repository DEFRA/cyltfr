SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_extent_merged_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

