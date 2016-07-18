SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.sea_level_depth_gauges_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

