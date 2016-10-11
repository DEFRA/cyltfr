\echo 'UFMFSW Depth 1 in 30 - Renaming _valid table original table'

ALTER TABLE u_ltfri.ufmfsw_depth_1_in_30_bv_bng_valid RENAME TO ufmfsw_depth_1_in_30_bv_bng;

ALTER SEQUENCE ufmfsw_depth_1_in_30_bv_bng_valid_ogc_fid_seq
  RENAME TO ufmfsw_depth_1_in_30_bv_bng_ogc_fid_seq;
