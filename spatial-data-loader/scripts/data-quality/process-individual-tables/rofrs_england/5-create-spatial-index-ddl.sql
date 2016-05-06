\echo 'ROFRS England - Create Spatial Index'

CREATE INDEX rofrs_england_bv_bng_wkb_geometry_geom_idx
  ON rofrs_england_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
