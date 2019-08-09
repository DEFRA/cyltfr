# Long term flood risk information (ltfri)

## Flood Risk Service component (flood-risk-service)

## Database setup

# Create the stored procedure that calculates long term flood risk associated with a point (One time exercise).
cd <<local repository directory>>/spatial-data-loader/scripts

sudo -u postgres -g postgres psql -d ltfridev -U u_ltfri

Within postgres session:

\i calculate-flood-risk-ddl.sql
\q

### start service

`npm start`

### test service

`npm test`

### Use service

do http `GET` on `http://{host}:8050/floodrisk/{x}/{y}/radius`

# Environment variables
(Be sure to describe any environment variables here by maintaining a list like this)

| name     | description      | required | default |            valid            | notes |
|----------|------------------|:--------:|---------|:---------------------------:|-------|
| NODE_ENV | Node environment |    no    |         | development,test,production |       |
| PORT     | Port number      |    no    | 3000    |                             |       |

# Prerequisites

Node v8+

# Running the application

`$ node index.js`
