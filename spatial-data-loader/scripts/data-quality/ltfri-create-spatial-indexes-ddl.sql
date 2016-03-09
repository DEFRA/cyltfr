\echo 'Extra Info - Create Spatial Index'

CREATE INDEX extra_info_bv_bng_wkb_geometry_geom_idx
  ON extra_info_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'Flood Alert Areas - Create Spatial Index'

CREATE INDEX flood_alert_area_bv_bng_wkb_geometry_geom_idx
  ON flood_alert_area_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'Flood Warning Areas - Create Spatial Index'

CREATE INDEX flood_warning_area_bv_bng_wkb_geometry_geom_idx
  ON flood_warning_area_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'Lead Local Flood Authorities - Create Spatial Index'

CREATE INDEX lead_local_flood_authority_bv_bng_wkb_geometry_geom_idx
  ON lead_local_flood_authority_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'River Level Depth and Flow Gauges - Create Spatial Index'

CREATE INDEX river_level_depth_and_flow_gauges_bv_bng_wkb_geometry_geom_idx
  ON river_level_depth_and_flow_gauges_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'ROF Reservoir Depth - Create Spatial Index'

CREATE INDEX rof_reservoir_depth_bv_bng_wkb_geometry_geom_idx
  ON rof_reservoir_depth_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'ROF Reservoir Extent - Create Spatial Index'

CREATE INDEX rof_reservoir_extent_bv_bng_wkb_geometry_geom_idx
  ON rof_reservoir_extent_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'ROF Reservoir Extent Merged - Create Spatial Index'

CREATE INDEX rof_reservoir_extent_merged_bv_bng_wkb_geometry_geom_idx
  ON rof_reservoir_extent_merged_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'ROF Reservoir Velocity - Create Spatial Index'

CREATE INDEX rof_reservoir_velocity_bv_bng_wkb_geometry_geom_idx
  ON rof_reservoir_velocity_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'ROFRS England - Create Spatial Index'

CREATE INDEX rofrs_england_bv_bng_wkb_geometry_geom_idx
  ON rofrs_england_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'Sea Level Depth Gauges - Create Spatial Index'

CREATE INDEX sea_level_depth_gauges_bv_bng_wkb_geometry_geom_idx
  ON sea_level_depth_gauges_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Depth 1 in 1000 - Create Spatial Index'

CREATE INDEX ufmfsw_depth_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_depth_1_in_1000_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Depth 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_depth_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_depth_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Depth 1 in 30 - Create Spatial Index'

CREATE INDEX ufmfsw_depth_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_depth_1_in_30_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Extent 1 in 1000 - Create Spatial Index'

CREATE INDEX ufmfsw_extent_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_extent_1_in_1000_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Extent 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_extent_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_extent_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Extent 1 in 30 - Create Spatial Index'

CREATE INDEX ufmfsw_extent_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_extent_1_in_30_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Flow Direction 1 in 1000 - Create Spatial Index'

CREATE INDEX ufmfsw_flow_direction_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_flow_direction_1_in_1000_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Flow Direction 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_flow_direction_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_flow_direction_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Flow Direction 1 in 30 - Create Spatial Index'

CREATE INDEX ufmfsw_flow_direction_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_flow_direction_1_in_30_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Suitability - Create Spatial Index'

CREATE INDEX ufmfsw_suitability_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_suitability_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Velocity 1 in 1000 - Create Spatial Index'

CREATE INDEX ufmfsw_velocity_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_velocity_1_in_1000_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Velocity 1 in 100 - Create Spatial Index'

CREATE INDEX ufmfsw_velocity_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_velocity_1_in_100_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;

\echo 'UFMFSW Velocity 1 in 30 - Create Spatial Index'

CREATE INDEX ufmfsw_velocity_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON ufmfsw_velocity_1_in_30_bv_bng
  USING gist
  (wkb_geometry)
TABLESPACE postgis_indexes;