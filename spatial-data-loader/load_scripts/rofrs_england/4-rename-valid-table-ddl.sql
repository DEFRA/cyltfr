\echo 'ROFRS England - Renaming _valid table original table'

ALTER TABLE u_ltfri.rofrs_england_bv_bng_valid RENAME TO rofrs_england_bv_bng;

ALTER SEQUENCE rofrs_england_bv_bng_valid_ogc_fid_seq
  RENAME TO rofrs_england_bv_bng_ogc_fid_seq;
