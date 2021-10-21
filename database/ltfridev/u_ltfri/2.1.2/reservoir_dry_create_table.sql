-- Table: u_ltfri.rof_reservoir_extent_dry_bv_bng

-- DROP TABLE u_ltfri.rof_reservoir_extent_dry_bv_bng;

CREATE TABLE u_ltfri.rof_reservoir_extent_dry_bv_bng
(
    reservoir character varying(64) COLLATE pg_catalog."default",
    ngr character varying(12) COLLATE pg_catalog."default",
    llfa_name character varying(64) COLLATE pg_catalog."default",
    undertaker character varying(128) COLLATE pg_catalog."default",
    risk_designation character varying(18) COLLATE pg_catalog."default",
    comments character varying(128) COLLATE pg_catalog."default",
    shape_length double precision,
    shape_area double precision,
    wkb_geometry geometry(MultiPolygon,27700),
    ogc_fid integer NOT NULL DEFAULT nextval('rof_reservoir_extent_dry_bv_bng_ogc_fid_seq'::regclass),
    CONSTRAINT rof_reservoir_extent_dry_bv_bng_valid_pkey PRIMARY KEY (ogc_fid)
)

TABLESPACE postgis_tables;

ALTER TABLE u_ltfri.rof_reservoir_extent_dry_bv_bng
    OWNER to u_ltfri;
-- Index: rof_reservoir_extent_dry_bv_bng_wkb_geometry_geom_idx

-- DROP INDEX u_ltfri.rof_reservoir_extent_dry_bv_bng_wkb_geometry_geom_idx;

CREATE INDEX rof_reservoir_extent_dry_bv_bng_wkb_geometry_geom_idx
    ON u_ltfri.rof_reservoir_extent_dry_bv_bng USING gist
    (wkb_geometry)
    TABLESPACE postgis_indexes;

ALTER TABLE u_ltfri.rof_reservoir_extent_dry_bv_bng
    CLUSTER ON rof_reservoir_extent_dry_bv_bng_wkb_geometry_geom_idx;	