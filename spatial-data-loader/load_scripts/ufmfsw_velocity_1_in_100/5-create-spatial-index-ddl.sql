\echo 'UFMFSW Velocity 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_velocity_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_velocity_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
