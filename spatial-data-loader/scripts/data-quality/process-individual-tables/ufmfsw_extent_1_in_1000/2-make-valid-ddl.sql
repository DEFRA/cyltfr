\echo 'UFMFSW Extent 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid TABLESPACE postgis_tables AS WITH
	make_valid(pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_extent_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

ALTER TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid ADD COLUMN ogc_fid SERIAL;
UPDATE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid SET ogc_fid = DEFAULT;
ALTER TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid ADD PRIMARY KEY(ogc_fid);
