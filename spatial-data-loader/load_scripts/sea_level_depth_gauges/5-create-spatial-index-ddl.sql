\echo 'Sea Level Depth Gauges - Create Spatial Index'

CREATE INDEX sea_level_depth_gauges_bv_bng_wkb_geometry_geom_idx
  ON sea_level_depth_gauges_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
