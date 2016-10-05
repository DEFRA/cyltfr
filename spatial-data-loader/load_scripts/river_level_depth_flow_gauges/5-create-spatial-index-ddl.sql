\echo 'River Level Depth and Flow Gauges - Create Spatial Index'

CREATE INDEX river_level_depth_and_flow_gauges_bv_bng_wkb_geometry_geom_idx
  ON river_level_depth_and_flow_gauges_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
