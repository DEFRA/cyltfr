# Long term flood risk information (ltfri)

## Web application component (ltfri-app)

### Clone
`git clone git@gitlab.envage.co.uk:flood/ltfri.git`

### Enable use of module specific environment variables
### Add the following line to .profile
source $HOME/ltfri/node/app/etc/.profile

### Source ~/.profile or logout/login or reboot for .profile changes to take effect

### Install dependencies
`npm i`

### Build
`npm run build`

### Test
`npm test`

## Start
Before starting, ensure `pm2` is installed globally `npm i -g pm2`

### Start server (dev)
`npm run dev`

Open `http://localhost:3001`

### Start server (production)
`npm start` (Assumes `pm2` is installed globally `npm i -g forever`)
