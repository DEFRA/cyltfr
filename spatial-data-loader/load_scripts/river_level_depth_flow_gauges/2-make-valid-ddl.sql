\echo 'River Level Depth and Flow Gauges - MakeValid'

CREATE TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid TABLESPACE postgis_tables AS WITH
	make_valid(id,region,area,location,station_no,watercours,easting,nffs_ref,northing,rloi_ref,flow_30,flow_100,flow_1000,ma_30,ma_100,ma_1000,bathtubs_30,bathtubs_100,bathtubs_1000,sp_30,
	sp_100,sp_1000,depth_30,depth_100,depth_1000,wkb_geometry) AS
		(SELECT id,region,area,location,station_no,watercours,easting,nffs_ref,northing,rloi_ref,flow_30,flow_100,flow_1000,ma_30,ma_100,ma_1000,bathtubs_30,bathtubs_100,bathtubs_1000,sp_30,
				sp_100,sp_1000,depth_30,depth_100,depth_1000,
				(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.river_level_depth_and_flow_gauges_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

ALTER TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid ADD COLUMN ogc_fid SERIAL;
UPDATE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid SET ogc_fid = DEFAULT;
ALTER TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid ADD PRIMARY KEY(ogc_fid);
