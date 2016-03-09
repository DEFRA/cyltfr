# U_LTFRI Spatial Data Clean Up Process. All scripts should be run as U_LTFRI user. 
# Ensure that tablespace usage is less than 50% of capacity before beginning.

# Write data quality reports to the /home/ubuntu/ltfri/spatial-data-loader/reports/ folder. 
# Reconfigure the output path if necessary.

1 - \i ltfri-is-valid-dml.sql

# Make a clean new copy of each table with _valid appended to the name.

2 - \i lfri-make-valid-tables-ddl.sql

# Drop the original tables that have been copied during the make valid process.

3 - \i ltfri-drop-tables-ddl.sql 

# Rename the _valid tables back to original table names.

4 - \i ltfri-rename-valid-tables-ddl.sql 

# Create new spatial indexes for the cleaned tables.

5 - \i ltfri-create-spatial-indexes-ddl.sql

# Run this script again, no spatial data errors should now be present.

6 - \i ltfri-is-valid-final-check-dml.sql 
