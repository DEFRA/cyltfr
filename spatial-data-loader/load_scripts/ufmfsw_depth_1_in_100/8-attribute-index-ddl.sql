-- Index: ufmfsw_depth_1_in_100_bv_bng_depth_idx

CREATE INDEX ufmfsw_depth_1_in_100_bv_bng_depth_idx
  ON ufmfsw_depth_1_in_100_bv_bng
  USING btree
  (depth COLLATE pg_catalog."default")
TABLESPACE ltfri_indexes;