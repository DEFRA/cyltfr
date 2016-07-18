SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

