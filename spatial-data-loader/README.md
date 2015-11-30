# Instructions for loading long term flood risk spatial data subset.

# TO DO - Review and refactor before publishing as open source.

# Install gdal 1.11 to allow file geodatabases to be read.  Ubuntu 14.04 software repositories only
# provide access to gdal 1.10 so gdal 1.11 has to be compiled from source.  For convenience,
# the Amazon S3 ltfri bucket contains a gdal 1.11 debian package created by compiling gdal 1.11 from
# source with use of checkinstall.
sudo dpkg -i <<path to gdal_1.11.3-1_amd64.deb>>/gdal_1.11.3-1_amd64.deb

# Check that gdal 1.11 installed correctly (the output of the followinbg command should include -> "OpenFileGDB" (readonly))
ogrinfo --formats

# Enable use of module specific environment variables
# Add the following line to .profile
source $HOME/ltfri/spatial-data-loader/etc/.profile

# Source ~/.profile or logout/login or reboot for .profile changes to take effect

# Copy the long term flood risk subset layers to the location specified by
# the environment variable LTFRI_GDB_ROOT in $HOME/ltfri/spatial-data-loader/etc/.profile

# Assuming the existence of a Postgres 9.3 database with:
#   PostGIS extension installed
#   postgis_tables tablespace for spatial data tables.
#   postgis_indexes tablespace for spatial data indexes.
#   u_ltfri role
# Apply read only permissions on the postgis schema to the u_ltfri role
# and delete the srid created accidentally (srid 900914) when the initial
# subset import was performed using the postgres user account.  The incorrect
# srid causes the long term flood risk stored procedure to fail.

cd /home/ltfridev/ltfri/spatial-data-loader/scripts

sudo -u postgres -g postgres psql -d <<database name>> -U postgres
  revoke all on schema postgis from u_ltfri;
  grant usage on schema postgis to u_ltfri;
  grant select on all tables in schema postgis to u_ltfri;
  grant create on tablespace postgis_tables to u_ltfri;
  grant create on tablespace postgis_indexes to u_ltfri;
  delete from postgis.spatial_ref_sys where srid = 900914;
\q

# Drop the existing spatial tables.
sudo -u postgres -g postgres psql -d <<database name>> -U u_ltfri
  \i drop-spatial-tables-ddl.sql
\q

# Load the long term flood risk subset layers
./load_ltfri_layers.sh

# Create spatial indexes in the postgis_indexes tablespace, move the
# spatial tables into the postgis_tables tablespace and create
# the stored procedure that calculates long term flood risk for a point.
sudo -u postgres -g postgres psql -d <<database name>> -U u_ltfri
  \i create-spatial-indexes-ddl.sql
  \i alter-tablespace-ddl.sql
  \i calculate-flood-risk-ddl.sql
\q
