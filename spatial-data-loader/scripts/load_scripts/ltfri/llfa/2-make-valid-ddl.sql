\echo 'Lead Local Flood Authorities - MakeValid'

CREATE TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid TABLESPACE postgis_tables AS WITH
	make_valid(name,descriptio,code,country,area,rbd_count,rbd_names,old_code,ea_reg_wm1,ea_reg_wm2,ea_reg_wm3,shape_length,shape_area,wkb_geometry) AS
		(SELECT name,descriptio,code,country,area,rbd_count,rbd_names,old_code,ea_reg_wm1,ea_reg_wm2,ea_reg_wm3,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.lead_local_flood_authority_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

ALTER TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid ADD COLUMN ogc_fid SERIAL;
UPDATE u_ltfri.lead_local_flood_authority_bv_bng_valid SET ogc_fid = DEFAULT;
ALTER TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid ADD PRIMARY KEY(ogc_fid);
