-- Index: rofrs_england_bv_bng_prob_4band_idx

CREATE INDEX rofrs_england_bv_bng_prob_4band_idx
  ON rofrs_england_bv_bng
  USING btree
  (prob_4band COLLATE pg_catalog."default")
TABLESPACE ltfri_indexes;