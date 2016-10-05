-- Index: rof_reservoir_depth_bv_bng_depth_idx

CREATE INDEX rof_reservoir_depth_bv_bng_depth_idx
  ON rof_reservoir_depth_bv_bng
  USING btree
  (depth COLLATE pg_catalog."default")
TABLESPACE ltfri_indexes;