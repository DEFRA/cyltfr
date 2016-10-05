SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.river_level_depth_and_flow_gauges_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

