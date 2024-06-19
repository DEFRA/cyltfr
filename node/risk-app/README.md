# Long term flood risk information (ltfri)

## Flood Risk App component (flood-risk-app)

### Build app

`npm run build`

### Start app

`npm start`

### Test app

`npm test`

# Environment variables (TODO: These are currently loaded via the config/server.json file not env vars)
| name                        |      description      | required  |   default   |            valid            | notes |
|-----------------------------|-----------------------|:---------:|-------------|:---------------------------:|-------|
| NODE_ENV                    | Node environment      |    no     | development | development,test,production |       |
| RISK_APP_HOST               | Node environment      |   yes     |             |                             |       |
| PORT                        | Node environment      |   yes     |             |                             |       |
| GEOSERVER_URL               | Node environment      |   yes     |             |                             |       |
| SERVICE_URL                 | Node environment      |   yes     |             |                             |       |
| SIMULATE_ADDRESS_SERVICE    | Node environment      |    no     | false       |                             |       |
| HTTP_TIMEOUT_MS             | Node environment      |   yes     |             |                             |       |
| G4_ANALYTICS_ACCOUNT        | Node environment      |    no     |             |                             |       |
| GTAG_MANAGER_ID             | Node environment      |    no     |             |                             |       |
| FLOOD_WARNINGS_URL          | Node environment      |   yes     |             |                             |       |
| FLOOD_RISK_URL              | Node environment      |   yes     |             |                             |       |
| OS_POSTCODE_URL             | Node environment      |   yes     |             |                             |       |
| OS_CAPABILITIES_URL         | Node environment      |   yes     |             |                             |       |
| OS_MAPS_URL                 | Node environment      |   yes     |             |                             |       |
| OS_NAMES_URL                | Node environment      |   yes     |             |                             |       |
| OS_SEARCH_KEY               | Node environment      |   yes     |             |                             |       |
| OS_MAPS_KEY                 | Node environment      |   yes     |             |                             |       |
| HTTP_PROXY                  | Node environment      |    no     |             |                             |       |
| RATE_LIMIT_ENABLED          | Node environment      |    no     | false       |                             |       |
| RATE_LIMIT_REQUESTS         | Node environment      |    no     |             |                             |       |
| RATE_LIMIT_EXPIRES_IN       | Node environment      |    no     |             |                             |       |
| RATE_LIMIT_WHITELIST        | Node environment      |   yes     | []          |                             |       |
| REDIS_CACHE_ENABLED         | Node environment      |    no     | false       |                             |       |
| REDIS_CACHE_HOST            | Node environment      |    no     |             |                             |       |
| REDIS_CACHE_PORT            | Node environment      |    no     |             |                             |       |
| COOKIE_PASSWORD             | Node environment      |   yes     |             |                             |       |
| FRIENDLY_CAPTCHA_ENABLED    | Node environment      |    no     | false       |                             |       |
| FRIENDLY_CAPTCHA_SITE_KEY   | Node environment      |    no     |             |                             |       |
| FRIENDLY_CAPTCHA_SECRET_KEY | Node environment      |    no     |             |                             |       |
| FRIENDLY_CAPTCHA_URL        | Node environment      |    no     |             |                             |       |
| FRIENDLY_CAPTCHA_BYPASS     | Node environment      |    no     |             |                             |       |
| SESSION_TIMEOUT             | Node environment      |    no     | 10          |                             |       |
| RISK_PAGE_FLAG              | Node environment      |    no     | false       |                             |       |
| CACHE_ENABLED               | Node environment      |    no     | true        |                             |       |
| ERRBIT_POST_ERRORS          | Node environment      |   yes     |             |                             |       |
| ERRBIT_ENV                  | Node environment      |   yes     |             |                             |       |
| ERRBIT_KEY                  | Node environment      |   yes     |             |                             |       |
| ERRBIT_HOST                 | Node environment      |   yes     |             |                             |       |
| ERRBIT_PROXY                | Node environment      |    no     |             |                             |       |

# Prerequisites

Node v20+

# Running the application locally

`$ node index.js`

# Debugging the application in docker using vscode

First build the debug image using

`$ npm run container:builddebug`

Configure vscode using a debug configuration launch.json like

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "address": "0.0.0.0",
      "name": "Attach",
      "port": 9229,
      "request": "attach",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/home/node/app",
      "type": "node"
    }
  ]
}
```

Then you can run the container in debug mode using

`$ npm run container:debug`

or 

`$ npm run cd`

This maps your source directory into the container, so that you can make changes locally and they'll be reflected in the container.

If you have auto-attach configured in vscode you might need to disable it for this to work.

When you have finished end the debug container using

`$ npm run container:stopdebug`

or 

`$ npm run cx`