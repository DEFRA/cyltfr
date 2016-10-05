\echo 'Lead Local Flood Authorities - Renaming _valid table original table'

ALTER TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid RENAME TO lead_local_flood_authority_bv_bng;

ALTER SEQUENCE lead_local_flood_authority_bv_bng_valid_ogc_fid_seq RENAME TO lead_local_flood_authority_bv_bng_ogc_fid_seq;
