const config = require('../../config')
const serverConfig = config.server

const manifest = {
  server: {
  },
  connections: [
    {
      port: serverConfig.port,
      host: serverConfig.host
    }
  ]
}

module.exports = manifest
