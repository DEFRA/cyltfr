\echo 'Lead Local Flood Authorities - Create Spatial Index'

CREATE INDEX lead_local_flood_authority_bv_bng_wkb_geometry_geom_idx
  ON lead_local_flood_authority_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;
