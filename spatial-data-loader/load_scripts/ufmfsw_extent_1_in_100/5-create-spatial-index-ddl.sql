\echo 'UFMFSW Extent 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_extent_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_extent_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
