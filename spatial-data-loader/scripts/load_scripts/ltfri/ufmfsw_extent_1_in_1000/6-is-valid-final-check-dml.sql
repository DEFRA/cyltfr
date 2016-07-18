SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

