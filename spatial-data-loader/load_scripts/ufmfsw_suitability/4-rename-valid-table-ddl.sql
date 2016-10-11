\echo 'UFMFSW Suitability - Renaming _valid table original table'

ALTER TABLE u_ltfri.ufmfsw_suitability_bv_bng_valid RENAME TO ufmfsw_suitability_bv_bng;

ALTER SEQUENCE ufmfsw_suitability_bv_bng_valid_ogc_fid_seq
  RENAME TO ufmfsw_suitability_bv_bng_ogc_fid_seq;
