# Long term flood risk information (ltfri)

## Gazetteer component (ltfri-flood-gazetteer)

## Data setup

The service works off of a simply Mongodb database that contains a large collection of address documents.  These need to be imported from a csv that is based on the nrd addressbase.

The Csv is roughly 2Gb and 29 million rows of data.

Install mongodb version 3.0.7 following the instructions at https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-14-04

Get a copy of the latest nrd csv from `\\prodds.ntnl\shared\NW\RFH\Groups\Cis\Business Solutions\Home2\Projects\JTB\NRD2014_v1.zip`

### Mongoimport (actual data)

`mongoimport -d gazetteer -c address --type csv --file NRD2014_v2.csv --headerline`

Note that you'll need roughly 20gb of space for the full dataload, if you don't want to do this follow the _test data_ import below

Then create a simple index on the PC_NOSPACE field of the documents created.

`db.address.createIndex({PC_NOSPACE: 1})`

Note that this takes roughly 5 minutes to complete.

use `db.currentOp()` to see the progress of the index creation.

### Mongoimport (test data)

Due to the size of the address data a test file has been provided so that devs only need to have a bare minimum number of addresses in their database.

_important: don't do this if you already have the address data available_

in `flood-gazetteer\test\` run `mongoimport -d gazetteer -c address --jsonArray --file address_test.js` This will import address data for 2 postcodes, used in the lab tests.

then `db.address.createIndex({PC_NOSPACE: 1})` although not as important due to size of the dataset.

### start service

`npm start`

### test service

`npm test`

### Use service

do http `GET` on `http://localhost:3002/addressbypostcode/{postcode}`
