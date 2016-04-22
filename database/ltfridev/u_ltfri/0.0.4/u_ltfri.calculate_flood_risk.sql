-- Function: calculate_flood_risk(numeric, numeric, integer)
-- Calculate the long term flood risk associated with a OSGB36 (SRS ID 27700) point.
-- Parameters
-- _x      - x portion of the point.
-- _y      - y portion of the point.
-- _radius - Radius of a buffer (in metres) surrounding the point.  This is used when calculating the long term risk of surface water flooding.

-- DROP FUNCTION calculate_flood_risk(numeric, numeric, integer);

CREATE OR REPLACE FUNCTION calculate_flood_risk(_x numeric, _y numeric, _radius integer)
  RETURNS json AS
$BODY$

declare within_england_result record;
declare flood_alert_area_result record;
declare flood_warning_area_result record;
declare rofrs_result record;
declare high_surface_water_result record;
declare medium_surface_water_result record;
declare low_surface_water_result record;
declare reservoir_result json;
declare surface_water_suitability_result record;
declare lead_local_flood_authority_result record;
declare extra_info_result record;
declare result json;
declare in_reservoir_risk_area boolean;
declare in_rofrs_risk_area boolean;
declare rofrs_error boolean;	
declare reservoir_error boolean;

begin

  -- Run the indivdual spatial queries with an error handling block around each to counter any issues in the source data.  If a particular layer causes an error, ensure there is an indication
  -- in the JSON returned to the client.

  -- England point in polygon query.
  begin
    select exists(select e.region_id from u_ltfri.england_010k e where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), e.wkb_geometry)) as in_england into within_england_result;
  exception when others then
    select 'Error'::text as in_england into within_england_result;
  end;
  -- Food alert area point in polygon query.
  begin
    select exists(select faa.fwis_code from u_ltfri.flood_alert_area_bv_bng faa where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), faa.wkb_geometry)) as in_flood_alert_area into flood_alert_area_result;
  exception when others then
    select 'Error'::text as in_flood_alert_area into flood_alert_area_result;
  end;
  begin
    -- Food warning area point in polygon query.
    select exists(select fwa.fwis_code from u_ltfri.flood_warning_area_bv_bng fwa where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), fwa.wkb_geometry)) as in_flood_warning_area into flood_warning_area_result;
  exception when others then
    select 'Error'::text as in_flood_warning_area into flood_warning_area_result;
  end;
  -- Low surface water risk radial buffered point in polygon query.
  begin
    select distinct 1 as ufmfsw_risk from u_ltfri.ufmfsw_extent_1_in_1000_bv_bng u where st_intersects(st_buffer(st_setsrid(st_makepoint(_x, _y), 27700), _radius), u.wkb_geometry) into low_surface_water_result;
  exception when others then
    select -1 as ufmfsw_risk into low_surface_water_result;
  end;
  begin
    -- Medium surface water risk radial buffered point in polygon query.
    select distinct 2 as ufmfsw_risk from u_ltfri.ufmfsw_extent_1_in_100_bv_bng u where st_intersects(st_buffer(st_setsrid(st_makepoint(_x, _y), 27700), _radius), u.wkb_geometry) into medium_surface_water_result;
  exception when others then
    select -1 as ufmfsw_risk into medium_surface_water_result;
  end;
  begin
    -- High surface water risk radial buffered point in polygon query.
    select distinct 3 as ufmfsw_risk from u_ltfri.ufmfsw_extent_1_in_30_bv_bng u where st_intersects(st_buffer(st_setsrid(st_makepoint(_x, _y), 27700), _radius), u.wkb_geometry) into high_surface_water_result;
  exception when others then
    select -1 as ufmfsw_risk into high_surface_water_result;
  end;
  begin
    -- Surface water risk results suitability point in polygon query.
    select suitability as surface_water_suitability from u_ltfri.ufmfsw_suitability_bv_bng s where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), s.wkb_geometry) into surface_water_suitability_result;
  exception when others then
    select 'Error'::text as surface_water_suitability into surface_water_suitability_result;
  end;
  begin
    -- Lead local flood authority point in polygon query.
    select name as lead_local_flood_authority from u_ltfri.lead_local_flood_authority_bv_bng l where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), l.wkb_geometry) into lead_local_flood_authority_result;
  exception when others then
    select 'Error'::text as lead_local_flood_authority into lead_local_flood_authority_result;
  end;
  begin
    -- Extra information point in polygon query.
    select info as extra_info from u_ltfri.extra_info_bv_bng l where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), l.wkb_geometry) into extra_info_result;
  exception when others then
    select 'Error'::text as extra_info into extra_info_result;
  end;
    -- Rivers and sea risk point in polygon query.
  begin
    select r.prob_4band, r.suitability, r.risk_for_insurance_sop from u_ltfri.rofrs_england_bv_bng r where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), r.wkb_geometry) into rofrs_result;
    in_rofrs_risk_area := found;
  exception when others then
    rofrs_error := true;
    select 'Error'::text as prob_4band, 'Error'::text as suitability, 'Error'::text as risk_for_insurance_sop into rofrs_result;
  end;
    -- Reservoirs risk point in polygon query.
  begin
     select array_to_json(array_agg(row_to_json(t))) as reservoir
        from (
	   select r.resname, r.risk_desig, r.location, r.utcompany as ut_company, r.ea_area,r.llfa_name, r.comments from u_ltfri.rof_reservoir_extent_bv_bng r where st_intersects(st_setsrid(st_makepoint(_x, _y), 27700), r.wkb_geometry)
	) t into reservoir_result;
     in_reservoir_risk_area := found;
  exception when others then
    reservoir_error := true;
  end;

  -- Produce the long term risk of flooding from various sources.
  with data as (
    select
      within_england_result.in_england,
      flood_alert_area_result.in_flood_alert_area,
      flood_warning_area_result.in_flood_warning_area,
      -- Only return details associated with risk of river and sea flooding if the spatial query returned results.
      case in_rofrs_risk_area or rofrs_error
        when true then
          rofrs_result.*
      end as rofrs_risk,
      -- Only return the highest risk of surface water flooding.  Default to Very Low when the spatial queries return no results.
      case greatest(coalesce(high_surface_water_result.ufmfsw_risk, medium_surface_water_result.ufmfsw_risk, low_surface_water_result.ufmfsw_risk, 0))
        when -1 then 'Error'
        when 0 then 'Very Low'
        when 1 then 'Low'
        when 2 then 'Medium'
        when 3 then 'High'
      end as surface_water_risk,
      -- Only return details associated with risk of reservoir flooding if the spatial query returned results.
      case in_reservoir_risk_area
        when true then
          reservoir_result
        else to_json('Error'::text)
      end as reservoir_risk,
      -- Default to Unknown if the spatial query return no results.
      coalesce(surface_water_suitability_result.surface_water_suitability, 'Unknown') as surface_water_suitability,
      -- Default to Unknown when the spatial query return no results.
      coalesce(lead_local_flood_authority_result.lead_local_flood_authority, 'Unknown') as lead_local_flood_authority,
      -- Place extra information in an array.
      extra_info_result.extra_info
  )

  -- Convert the result to JSON.  Unfortunately this does seem to support camel case attribute names even when camel case aliases are used in the SQL.
  select row_to_json(data) from data into result;
  return result;
end;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION calculate_flood_risk(numeric, numeric, integer)
  OWNER TO u_ltfri;
