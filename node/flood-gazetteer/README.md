# Long term flood risk information (ltfri)

## Gazetteer component (ltfri-flood-gazetteer)

## Data setup

The service works off of a simply Mongodb database that contains a large collection of address documents.  These need to be imported from a csv that is based on the nrd addressbase.

The Csv is roughly 2Gb and 29 million rows of data.

Install mongodb version 3.0.7 following the instructions at https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04

Get a copy of the latest nrd csv from `\\prodds.ntnl\shared\NW\RFH\Groups\Cis\Business Solutions\Home2\Projects\JTB\NRD2014_v1.zip`

### Mongoimport

`mongoimport -d gazetteer -c address --type csv --file NRD2014_v2.csv --headerline`

Note that you'll need roughly 20gb of space for the full dataload, otherwise import a stripped down version of the file. do something like

`head -200 NRD2014_v2.csv > addressbase_200.csv`

Then create a simple index on the PC_NOSPACE field of the documents created.

`db.address.createIndex({PC_NOSPACE: 1})`

Note that this takes roughly 5 minutes to complete.

use `db.currentOp()` to see the progress of the index creation.

### start service

`npm start`

### test service

`npm test`

### Use service

do http `GET` on `http://localhost:3002/addressbypostcode/{postcode}`
