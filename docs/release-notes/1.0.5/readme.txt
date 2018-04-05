## LTFRI Reservoir DATA Release
## Version 1.0.5
## Date 10/04/2018

##Webops instructions

### !Important, remember to take off a database from ELB to perform data load, once complete switch databases on ELB and run the cache copy. Finally update the 2nd database and return to ELB (This step was initially forgotten on ROFRS data release of 27/03/18).

### Data load: 
```
Run Jenkins job: FR_EA_99_LOAD_RESERVOIRS
```
### Tile cache update: 
```
aws s3 sync s3://flood-risk-dev//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd1/ s3://flood-risk-prod//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd1/ --delete
aws s3 sync s3://flood-risk-dev//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd0/ s3://flood-risk-prod//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd0/ --delete
aws s3 sync s3://flood-risk-dev//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fcc/ s3://flood-risk-prod//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fcc/ --delete
```

Run full application build (please note there are no code changes involved, only the application version number)

And confirm auto tests complete correctly.
