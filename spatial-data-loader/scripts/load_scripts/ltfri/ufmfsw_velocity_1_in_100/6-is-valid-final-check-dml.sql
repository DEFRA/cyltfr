SELECT reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

