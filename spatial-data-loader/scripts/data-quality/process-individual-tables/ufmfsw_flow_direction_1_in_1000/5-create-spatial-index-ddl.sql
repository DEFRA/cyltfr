\echo 'UFMFSW Flow Direction 1 in 1000 - Create Spatial Index'

CREATE INDEX ufmfsw_flow_direction_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_flow_direction_1_in_1000_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
