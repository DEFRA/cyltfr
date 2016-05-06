-- Index: rof_reservoir_velocity_bv_bng_velocity_idx

CREATE INDEX rof_reservoir_velocity_bv_bng_velocity_idx
  ON rof_reservoir_velocity_bv_bng
  USING btree
  (velocity COLLATE pg_catalog."default")
TABLESPACE ltfri_indexes;