SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.rof_reservoir_velocity_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

