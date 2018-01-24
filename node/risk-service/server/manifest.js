const config = require('../config')
const serverConfig = config.server

const manifest = {
  server: {
    port: serverConfig.port,
    host: serverConfig.host
  },
  register: {
    plugins: [
      {
        plugin: 'good',
        options: config.logging
      },
      './plugins/log-errors',
      './plugins/router'
    ]
  }
}

if (config.errbit.postErrors) {
  delete config.errbit.postErrors
  manifest.register.plugins.push({
    plugin: 'node-hapi-airbrake',
    options: config.errbit
  })
}

module.exports = manifest
