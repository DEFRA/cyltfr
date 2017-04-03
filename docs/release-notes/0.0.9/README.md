# Release 0.0.9

FLO-1894 Update NPM dependencies across LTFRI (risk-app, risk-service, risk-app-tests)
FLO-1875: Development - Add Groundwater content to the risk screen
FLO-1876: Development - Add Groundwater content to the risk detail screen
FLO-1877: User Experience – Create GW image for risk detail screen
FLO-1833: Provide groundwater additional information

# Special notes

The /database/ltfridev/u_ltfri/0.0.9/calculate_flood_risk.sql script needs to be run into database manually, as liquibase is on the tech debt backlog for LTFRI.

The previous version (for rollback): /database/ltfridev/u_ltfri/0.0.4/calculate_flood_risk.sql

The way log files are handled by the application has changed. The log rotation is no longer handled by the application. Please monitor the 'risk-app/logs/error.log' and 'risk-service/logs/error.log' files.
