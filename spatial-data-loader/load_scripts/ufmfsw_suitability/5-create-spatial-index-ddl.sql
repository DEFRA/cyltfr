\echo 'UFMFSW Suitability - Create Spatial Index'

CREATE INDEX ufmfsw_suitability_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_suitability_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
