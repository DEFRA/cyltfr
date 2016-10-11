\echo 'River Level Depth and Flow Gauges - Renaming _valid table original table'

ALTER TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid RENAME TO river_level_depth_and_flow_gauges_bv_bng;

ALTER SEQUENCE river_level_depth_and_flow_gauges_bv_bng_valid_ogc_fid_seq
  RENAME TO river_level_depth_and_flow_gauges_bv_bng_ogc_fid_seq;
