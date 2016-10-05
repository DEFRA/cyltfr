\echo 'Sea Level Depth Gauges - Renaming _valid table original table'

ALTER TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid RENAME TO sea_level_depth_gauges_bv_bng;

ALTER SEQUENCE sea_level_depth_gauges_bv_bng_valid_ogc_fid_seq
  RENAME TO sea_level_depth_gauges_bv_bng_ogc_fid_seq;
