\echo 'ROF Reservoir Velocity - Create Spatial Index'

CREATE INDEX rof_reservoir_velocity_bv_bng_wkb_geometry_geom_idx
  ON rof_reservoir_velocity_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;