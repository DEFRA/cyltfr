-- Create spatial indexes for long term flood risk layers
CREATE INDEX extra_info_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.extra_info_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

CREATE INDEX flood_alert_area_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.flood_alert_area_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

CREATE INDEX flood_warning_area_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.flood_warning_area_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

 CREATE INDEX lead_local_flood_authority_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.lead_local_flood_authority_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

 CREATE INDEX river_level_depth_and_flow_gauges_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.river_level_depth_and_flow_gauges_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

 CREATE INDEX rof_reservoir_depth_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.rof_reservoir_depth_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX rof_reservoir_extent_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.rof_reservoir_extent_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX rof_reservoir_extent_merged_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.rof_reservoir_extent_merged_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX rof_reservoir_velocity_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.rof_reservoir_velocity_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX rofrs_england_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.rofrs_england_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX sea_level_depth_gauges_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.sea_level_depth_gauges_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_depth_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_depth_1_in_1000_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_depth_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_depth_1_in_100_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_depth_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_depth_1_in_30_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_extent_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_extent_1_in_1000_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_extent_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_extent_1_in_100_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_extent_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_extent_1_in_30_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_flow_direction_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_flow_direction_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_flow_direction_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_suitability_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_suitability_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_velocity_1_in_1000_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_velocity_1_in_100_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_velocity_1_in_100_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;

  CREATE INDEX ufmfsw_velocity_1_in_30_bv_bng_wkb_geometry_geom_idx
  ON u_ltfri.ufmfsw_velocity_1_in_30_bv_bng
  USING gist
  (wkb_geometry) TABLESPACE postgis_indexes;
