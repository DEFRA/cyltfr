var config = require('../config')
var serverConfig = config.server
var dbConfig = config.database

const manifest = {
  server: {
  },
  connections: [
    {
      port: serverConfig.port,
      host: serverConfig.host
    }
  ],
  registrations: [
    {
      plugin: {
        register: 'hapi-node-postgres',
        options: dbConfig
      }
    },
    {
      plugin: {
        register: 'good',
        options: config.logging
      }
    }
  ]
}

if (config.errbit.postErrors) {
  delete config.errbit.postErrors
  manifest.registrations.push({
    plugin: {
      register: 'node-hapi-airbrake',
      options: config.errbit
    }
  })
}

module.exports = manifest
