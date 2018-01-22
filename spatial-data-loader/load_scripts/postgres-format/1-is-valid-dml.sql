\o depth_1_in_1000_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o depth_1_in_100_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o depth_1_in_30_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_depth_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o extent_1_in_1000_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o extent_1_in_100_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o extent_1_in_30_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_extent_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o flow_direction_1_in_1000_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o flow_direction_1_in_100_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o flow_direction_1_in_30_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_flow_direction_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o suitability_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_suitability_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o velocity_1_in_1000_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_1000_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o velocity_1_in_100_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_100_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o

\o velocity_1_in_30_errors.log

SELECT ogc_fid, reason(ST_IsValidDetail(wkb_geometry)) FROM u_ltfri.ufmfsw_velocity_1_in_30_bv_bng WHERE ST_IsValid(wkb_geometry) = false;

\o
