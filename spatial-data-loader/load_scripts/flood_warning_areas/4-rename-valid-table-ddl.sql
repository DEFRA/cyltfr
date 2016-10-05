\echo 'Flood Warning Areas - Renaming _valid table original table'

ALTER TABLE u_ltfri.flood_warning_area_bv_bng_valid RENAME TO flood_warning_area_bv_bng;

ALTER SEQUENCE flood_warning_area_bv_bng_valid_ogc_fid_seq RENAME TO flood_warning_area_bv_bng_ogc_fid_seq;
