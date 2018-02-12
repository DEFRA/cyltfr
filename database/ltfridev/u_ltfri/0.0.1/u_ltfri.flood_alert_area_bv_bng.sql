-- Table: u_ltfri.flood_alert_area_bv_bng
-- DROP TABLE u_ltfri.flood_alert_area_bv_bng;

-- Sequence: flood_alert_area_bv_bng_ogc_fid_seq

-- DROP SEQUENCE flood_alert_area_bv_bng_ogc_fid_seq;

CREATE SEQUENCE flood_alert_area_bv_bng_ogc_fid_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 1
  START 22736
  CACHE 1;
ALTER TABLE flood_alert_area_bv_bng_ogc_fid_seq
  OWNER TO u_ltfri;

CREATE TABLE u_ltfri.flood_alert_area_bv_bng
(
    ogc_fid integer NOT NULL DEFAULT nextval('u_ltfri.flood_alert_area_bv_bng_ogc_fid_seq'::regclass),
    wkb_geometry geometry(MultiPolygon,27700),
    region character varying COLLATE pg_catalog."default",
    area character varying COLLATE pg_catalog."default",
    fwd_tacode character varying COLLATE pg_catalog."default",
    fwis_code character varying COLLATE pg_catalog."default",
    fwa_name character varying COLLATE pg_catalog."default",
    descrip character varying COLLATE pg_catalog."default",
    river_sea character varying COLLATE pg_catalog."default",
    county character varying COLLATE pg_catalog."default",
    e_qdial character varying COLLATE pg_catalog."default",
    w_region character varying COLLATE pg_catalog."default",
    w_fwa_name character varying COLLATE pg_catalog."default",
    w_descrip character varying COLLATE pg_catalog."default",
    w_afon character varying COLLATE pg_catalog."default",
    w_qdial character varying COLLATE pg_catalog."default",
    shape_length double precision,
    shape_area double precision,
    CONSTRAINT flood_alert_area_bv_bng_pkey PRIMARY KEY (ogc_fid)
        USING INDEX TABLESPACE ltfri_tables
)
WITH (
    OIDS = FALSE
)
TABLESPACE postgis_tables;

ALTER TABLE u_ltfri.flood_alert_area_bv_bng
    OWNER to u_ltfri;

-- Index: flood_alert_area_bv_bng_wkb_geometry_geom_idx

-- DROP INDEX u_ltfri.flood_alert_area_bv_bng_wkb_geometry_geom_idx;

CREATE INDEX flood_alert_area_bv_bng_wkb_geometry_geom_idx
    ON u_ltfri.flood_alert_area_bv_bng USING gist
    (wkb_geometry)
    TABLESPACE postgis_indexes;
