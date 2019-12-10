

# risk-admin
This is the LTFRI management tool

# Environment variables

| name                    | description      | required |        default        |       valid        | notes |
|-------------------------|------------------|:--------:|-----------------------|:------------------:|-------|
| NODE_ENV                | Environment name |    no    | dev                   | dev,tst,pre,prd    |       |
| PORT                    | Port number      |    no    | 3000                  |                    |       |
| AD_CLIENT_ID            | AD Client Id     |    yes   |                       |                    |       |
| AD_CLIENT_SECRET        | AD Client Secret |    yes   |                       |                    |       |
| AD_TENANT               | AD Tenant        |    yes   |                       |                    |       |
| AD_COOKIE_PASSWORD      | Cookie password  |    yes   |                       |                    |       |
| IS_SECURE               | Secure cookie    |    no    | false                 |                    |       |
| FORCE_HTTPS             | Force https      |    no    | false                 |                    |       |
| HOME_PAGE               | Home page        |    no    | http://localhost:3000 |                    |       |
| AWS_BUCKET_REGION       | Cookie password  |    yes   |                       |                    |       |
| AWS_BUCKET_NAME         | Secure cookie    |    yes   |                       |                    |       |
| HOLDING_COMMENTS_PREFIX | Force https      |    no    | holding-comments      |                    |       |
| MANIFEST_FILENAME       | Home page        |    no    | manifest.json         |                    |       |
| LTFRI_DB_HOST           | DB Host          |    yes   |                       |                    |       |
| LTFRI_DB_PORT           | DB Port          |    yes   |                       |                    |       |
| LTFRI_DB_NAME           | DB Name          |    yes   |                       |                    |       |
| LTFRI_DB_USER           | DB User          |    yes   |                       |                    |       |
| LTFRI_DB_PASSWORD       | DB Password      |    yes   |                       |                    |       |
| LTFRI_DB_SCHEMA         | DB Schema        |    yes   |                       |                    |       |

# Prerequisites

Node v8+

# Running the application

First build the application using:

`$ npm run build`

This will build the css based on the `govuk-frontend` scss/styles.

Now the application is ready to run:

`$ node index.js`

Building the docker container

`npm run build:container`

Starting the docker container

`npm run start:container`

Removing (all) docker container

`docker rm -f -v $(docker ps -a -q)`

Initiailise a bash session in the running container

`docker exec -it ltfmgmt bash`


Notes
-----

If you want to debug locally and not run the docker container but don't have `ogr2ogr` installed
change the shp2json file to return the mock geojson on line 24.