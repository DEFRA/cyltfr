\echo 'Flood Alert Areas - Create Spatial Index'

CREATE INDEX flood_alert_area_bv_bng_wkb_geometry_geom_idx
  ON flood_alert_area_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
