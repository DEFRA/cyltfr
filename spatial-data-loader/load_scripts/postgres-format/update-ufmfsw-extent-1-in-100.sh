s3cmd get s3://ltfri/data-updates/ufmfsw_extent_1_in_100_bv_bng.zip --force

unzip -o ufmfsw_extent_1_in_100_bv_bng.zip

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "truncate table u_ltfri.ufmfsw_extent_1_in_100_bv_bng"

sudo -u postgres -g postgres pg_restore -d ${LTFRI_DB_NAME} < ufmfsw_extent_1_in_100_bv_bng.backup

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "SELECT setval('u_ltfri.ufmfsw_enw_extent_1in100_ogc_fid_seq', 6988779, true)"

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "CLUSTER u_ltfri.ufmfsw_extent_1_in_100_bv_bng USING ufmfsw_extent_1_in_100_bv_bng_wkb_geometry_geom_idx"

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "VACUUM (ANALYZE) u_ltfri.ufmfsw_extent_1_in_100_bv_bng"

rm ufmfsw_extent_1_in_100_bv_bng.zip

rm ufmfsw_extent_1_in_100_bv_bng.backup
