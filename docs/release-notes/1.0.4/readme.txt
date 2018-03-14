## LTFRI DATA Release
## Version 1.0.4
## Date 27/03/2018

##Webops instructions

### Data load: 
```
Run Jenkins job: FR_EA_99_LOAD_ROFRS_ENGLAND
```
### Tile cache update: 
```
aws s3 sync s3://flood-risk-dev//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd9/ s3://flood-risk-prod//LayerGroupInfoImpl--1a2a398b:1510f867e96:-7fd9/ --delete
```


