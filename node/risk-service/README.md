# Long term flood risk information (ltfri)

## Flood Risk Service component (flood-risk-service)

### Start service

`npm start`

### Test service

`npm test`

### Use service

do http `GET` on `http://{host}:{port}/floodrisk/{x}/{y}/radius`

# Environment variables (TODO: These are currently loaded via the config/server.json file not env vars)
| name     |      description      | required  |   default   |            valid            | notes |
|----------|-----------------------|:---------:|-------------|:---------------------------:|-------|
| NODE_ENV | Node environment      |    no     | development | development,test,production |       |
| HOST     | Hostname              |    yes    |             |                             |       |
| PORT     | Port number           |    yes    |             |                             |       |
| DB       | DB Connection String  |    yes    |             |                             |       |

# Prerequisites

Node v12+

# Running the application locally

`$ node index.js`
