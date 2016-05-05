LTFRI Spatial Data Maintenance

Pre-Requisites
--------------

1. Postgres version 9.3 installed
2. PostGIS extension installed
3. GDAL 1.1.1
4. u_ltfri schema in ltfridev database. Schema backup file is here:

Steps
-----

1. Information about each dataset used by the LTFRI system can be found in the 
ea.flood.ltfri.datadictionary spreadsheet:

https://docs.google.com/spreadsheets/d/1tnAF6kvHOxqdkLAa4CqVNcoYxdcTCVjg5SWF54beUw4/edit?ts=562f4500#gid=878632912

2. Using PGAdmin or PSQL delete the table(s) that you wish to replace with a new version.

3. Customise and run the GDAL ogr2ogr command for each dataset. 
An example of the ogr2ogr command is:

ogr2ogr -a_srs "EPSG:27700" -f "PostgreSQL" PG:"host=localhost p
ort=5432 dbname=ltfridev user=u_ltfri password=u_ltfri" d:\projects\ltfri\origin
al_data\surface_water_v3\uFMfSW_Banded_Vector_National.gdb -nln u_ltfri.ufmfsw_d
epth_1_in_100_bv_bng -overwrite -progress --config PG_USE_COPY YES -lco SPATIAL_
INDEX=flood_indexes --config SPATIAL_INDEX NO ufmfsw_enw_depth_1in100_BV

4. All spatial tables must be checked for validity/made valid before data is released to the test environment:

For each table:

5. Open the file \dataQuality\<tablename>\1-is-valid-dml.sql. Modify the reporting path.

6. Open a command prompt, log into the database using PSQL - 

psql -U u_ltfri -d ltfridev

7. Execute the is-valid script:

\i 1-is-valid-dml.sql

8. Check the log file. If there are any spatial errors continue the following steps,
otherwise check the validity of the next table.

9.Make a new table with a valid copy of the data:

\i 2-make-valid-ddl.sql

10. Drop the old table:

\i 3-drop-table-ddl.sql

11. Rename the valid table:

\i 4-rename-valid-table-ddl.sql

12. Create new spatial index:

\i 5-create-spatial-index-dll.sql

13. Open the file \dataQuality\<tablename>\6-is-valid-final-check-dml.sql. 
Modify the reporting path.

14. Run the is-valid check:

\i 6-is-valid-final-check-dml.sql

15. Cluster the data on the filesystem: 

\i 7-cluster-dll.sql

16. If available, create an attribute index:

\i 8-attribute-index-ddl.sql

17. When all tables are valid, export.

18. Export using PGAdmin. Log into the database.

19. Right click on the table to export. Choose Backup, enter a filename. Select data only
and ignore tablespace.



