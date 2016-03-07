# Long term flood risk information (risk)

## Web application component (risk-app)

### Clone
`git clone git@gitlab.envage.co.uk:flood/ltfri.git`

### Cloud deployment only
### Override module specific environment variables by copying the contents of
### etc/.profile to .profile on the target machine and configuring for the
### target environment accordingly.

### Install dependencies
`npm i`

### Build
`npm run build`

### Test
e2e tests can be found in the project risk-app-tests

## Start
Before starting, ensure `pm2` is installed globally `npm i -g pm2`

Ensure dependent services are running (risk-service and risk-gazetteer)

### Start server

Ensure risk-app/config/pm2.json contains the correct options for production or development

`npm start` (Assumes `pm2` is installed globally)

Open `http://localhost:3001`

[The OGL License](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/)
