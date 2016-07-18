\echo 'UFMFSW Flow Direction 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid TABLESPACE postgis_tables AS WITH
	make_valid(flowdir,pub_date,wkb_geometry) AS
		(SELECT flowdir,pub_date,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid ADD COLUMN ogc_fid SERIAL;
UPDATE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid SET ogc_fid = DEFAULT;
ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid ADD PRIMARY KEY(ogc_fid);
