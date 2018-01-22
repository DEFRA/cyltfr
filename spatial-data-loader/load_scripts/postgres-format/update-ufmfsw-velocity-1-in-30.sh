s3cmd get s3://ltfri/data-updates/ufmfsw_velocity_1_in_30_bv_bng.zip --force

unzip -o ufmfsw_velocity_1_in_30_bv_bng.zip

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "truncate table u_ltfri.ufmfsw_velocity_1_in_30_bv_bng"

sudo -u postgres -g postgres pg_restore -d ${LTFRI_DB_NAME} < ufmfsw_velocity_1_in_30_bv_bng.backup

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "SELECT setval('u_ltfri.ufmfsw_velocity_1_in_30_bv_bng_ogc_fid_seq', 75862765, true)"

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "CLUSTER u_ltfri.ufmfsw_velocity_1_in_30_bv_bng USING ufmfsw_velocity_1_in_30_bv_bng_wkb_geometry_geom_idx"

sudo -u postgres -g postgres psql -d ${LTFRI_DB_NAME} -c "VACUUM (ANALYZE) u_ltfri.ufmfsw_velocity_1_in_30_bv_bng"

rm ufmfsw_velocity_1_in_30_bv_bng.zip

rm ufmfsw_velocity_1_in_30_bv_bng.backup
