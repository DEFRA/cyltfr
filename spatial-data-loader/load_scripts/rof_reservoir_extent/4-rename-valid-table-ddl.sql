\echo 'ROF Reservoir Extent - Renaming _valid table original table'

ALTER TABLE u_ltfri.rof_reservoir_extent_bv_bng_valid RENAME TO rof_reservoir_extent_bv_bng;

ALTER SEQUENCE rof_reservoir_extent_bv_bng_valid_ogc_fid_seq
  RENAME TO rof_reservoir_extent_bv_bng_ogc_fid_seq;
