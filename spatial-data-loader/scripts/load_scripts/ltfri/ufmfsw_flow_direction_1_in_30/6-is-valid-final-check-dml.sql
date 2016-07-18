SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

