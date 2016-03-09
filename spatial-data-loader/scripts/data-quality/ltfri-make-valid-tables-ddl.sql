-- USE ST_MakeValid function to repair spatial data errors present in some tables

\echo 'Extra Info - MakeValid'

CREATE TABLE u_ltfri.extra_info_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid (id,info,apply,"start","end",shape_length,shape_area,wkb_geometry) AS
	(SELECT id,info,apply,"start","end",shape_length,shape_area,
		(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.extra_info_bv_bng
	)            
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.extra_info_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'Flood Alert Areas - MakeValid'

CREATE TABLE u_ltfri.flood_alert_area_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid (region,area,fwd_tacode,fwis_code,fwa_name,descrip,river_sea,county,e_qdial,w_region,w_fwa_name,w_descrip,w_afon,w_qdial,shape_length,shape_area,wkb_geometry) AS
	(SELECT region,area,fwd_tacode,fwis_code,fwa_name,descrip,river_sea,county,e_qdial,w_region,w_fwa_name,w_descrip,w_afon,w_qdial,shape_length,shape_area,
		(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.flood_alert_area_bv_bng
	)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.flood_alert_area_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'Flood Warning Areas - MakeValid'

CREATE TABLE u_ltfri.flood_warning_area_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(region,area,fwd_tacode,fwis_code,fwa_name,descrip,river_sea,county,parent,e_qdial,w_region,w_fwa_name,w_descrip,w_afon,w_qdial,shape_length,shape_area,wkb_geometry) AS
		(SELECT region,area,fwd_tacode,fwis_code,fwa_name,descrip,river_sea,county,parent,e_qdial,w_region,w_fwa_name,w_descrip,w_afon,w_qdial,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.flood_warning_area_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.flood_warning_area_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'Lead Local Flood Authorities - MakeValid'

CREATE TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(name,descriptio,code,country,area,rbd_count,rbd_names,old_code,ea_reg_wm1,ea_reg_wm2,ea_reg_wm3,shape_length,shape_area,wkb_geometry) AS
		(SELECT name,descriptio,code,country,area,rbd_count,rbd_names,old_code,ea_reg_wm1,ea_reg_wm2,ea_reg_wm3,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.lead_local_flood_authority_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.lead_local_flood_authority_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'River Level Depth and Flow Gauges - MakeValid'

CREATE TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(id,region,area,location,station_no,watercours,easting,nffs_ref,northing,rloi_ref,flow_30,flow_100,flow_1000,ma_30,ma_100,ma_1000,bathtubs_30,bathtubs_100,bathtubs_1000,sp_30,
	sp_100,sp_1000,depth_30,depth_100,depth_1000,wkb_geometry) AS
		(SELECT id,region,area,location,station_no,watercours,easting,nffs_ref,northing,rloi_ref,flow_30,flow_100,flow_1000,ma_30,ma_100,ma_1000,bathtubs_30,bathtubs_100,bathtubs_1000,sp_30,
				sp_100,sp_1000,depth_30,depth_100,depth_1000,
				(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.river_level_depth_and_flow_gauges_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.river_level_depth_and_flow_gauges_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

\echo 'ROF Reservoir Depth - MakeValid'

CREATE TABLE u_ltfri.rof_reservoir_depth_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid("depth",shape_length,shape_area,wkb_geometry) AS
		(SELECT "depth",shape_length,shape_area, 
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.rof_reservoir_depth_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.rof_reservoir_depth_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'ROF Reservoir Extent - MakeValid'

CREATE TABLE u_ltfri.rof_reservoir_extent_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(case_no,resname,location,risk_desig,utcompany,llfa_name,ea_area,comments,shape_length,shape_area,wkb_geometry) AS
		(SELECT case_no,resname,location,risk_desig,utcompany,llfa_name,ea_area,comments,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.rof_reservoir_extent_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.rof_reservoir_extent_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'ROF Reservoir Extent Merged - MakeValid'

CREATE TABLE u_ltfri.rof_reservoir_extent_merged_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(shape_length,shape_area,wkb_geometry) AS
		(SELECT shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.rof_reservoir_extent_merged_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.rof_reservoir_extent_merged_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'ROF Reservoir Velocity - MakeValid'

CREATE TABLE u_ltfri.rof_reservoir_velocity_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(velocity,shape_length,shape_area,wkb_geometry) AS
		(SELECT velocity,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.rof_reservoir_velocity_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.rof_reservoir_velocity_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'ROFRS England - MakeValid'

CREATE TABLE u_ltfri.rofrs_england_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(prob_4band,suitability,pub_date,risk_for_insurance_sop,shape_length,shape_area,wkb_geometry) AS
		(SELECT prob_4band,suitability,pub_date,risk_for_insurance_sop,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.rofrs_england_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.rofrs_england_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'Sea Level Depth Gauges - MakeValid'

CREATE TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(site,gridref,lat,"long",easting,northing,gauge,lev_30,lev_100,lev_1000,wkb_geometry) AS
		(SELECT site,gridref,lat,"long",easting,northing,gauge,lev_30,lev_100,lev_1000,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.sea_level_depth_gauges_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.sea_level_depth_gauges_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

\echo 'UFMFSW Depth 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_depth_1_in_1000_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid("depth",pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT "depth",pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_depth_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_depth_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Depth 1 in 100 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_depth_1_in_100_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid("depth",pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT "depth",pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_depth_1_in_100_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_depth_1_in_100_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Depth 1 in 30 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_depth_1_in_30_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid("depth",pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT "depth",pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_depth_1_in_30_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_depth_1_in_30_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Extent 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_extent_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_extent_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Extent 1 in 100 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_extent_1_in_100_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_extent_1_in_100_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_extent_1_in_100_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Extent 1 in 30 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_extent_1_in_30_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_extent_1_in_30_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_extent_1_in_30_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Flow Direction 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(flowdir,pub_date,wkb_geometry) AS
		(SELECT flowdir,pub_date,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');

ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

\echo 'UFMFSW Flow Direction 1 in 100 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(flowdir,pub_date,wkb_geometry) AS
		(SELECT flowdir,pub_date,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');	

ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

\echo 'UFMFSW Flow Direction 1 in 30 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(flowdir,pub_date,wkb_geometry) AS
		(SELECT flowdir,pub_date,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Point','ST_MultiPoint');	

ALTER TABLE u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Point,27700);

\echo 'UFMFSW Suitability - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_suitability_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH    
	make_valid(suitability,pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT suitability,pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_suitability_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_suitability_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Velocity 1 in 1000 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(velocity,pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT velocity,pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Velocity 1 in 100 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_velocity_1_in_100_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(velocity,pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT velocity,pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_velocity_1_in_100_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_velocity_1_in_100_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);

\echo 'UFMFSW Velocity 1 in 30 - MakeValid'

CREATE TABLE u_ltfri.ufmfsw_velocity_1_in_30_bv_bng_valid WITH (OIDS=true) TABLESPACE postgis_tables AS WITH
	make_valid(velocity,pub_date,shape_length,shape_area,wkb_geometry) AS
		(SELECT velocity,pub_date,shape_length,shape_area,
			(ST_Dump(ST_MakeValid(wkb_geometry))).geom AS wkb_geometry FROM u_ltfri.ufmfsw_velocity_1_in_30_bv_bng
		)
SELECT * FROM make_valid WHERE ST_GeometryType(wkb_geometry) IN('ST_Polygon','ST_MultiPolygon');

ALTER TABLE u_ltfri.ufmfsw_velocity_1_in_30_bv_bng_valid ALTER COLUMN wkb_geometry TYPE geometry(Multipolygon,27700) USING ST_Multi(wkb_geometry);