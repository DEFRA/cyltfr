\echo 'Sea Level Depth Gauges - MakeValid'

CREATE TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid TABLESPACE postgis_tables AS WITH
	make_valid(site,gridref,lat,"long",easting,northing,gauge,lev_30,lev_100,lev_1000,wkb_geometry) AS
		(SELECT site,gridref,lat,"long",easting,northing,gauge,lev_30,lev_100,lev_1000,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.sea_level_depth_gauges_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

ALTER TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid ADD COLUMN ogc_fid SERIAL;
UPDATE u_ltfri.sea_level_depth_gauges_bv_bng_valid SET ogc_fid = DEFAULT;
ALTER TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid ADD PRIMARY KEY(ogc_fid);
