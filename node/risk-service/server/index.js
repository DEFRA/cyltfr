const hapi = require('@hapi/hapi')
const config = require('./config')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    host: config.server.host,
    port: config.server.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    }
  })

  // Register the plugins
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/log-errors'))
  await server.register(require('blipp'))

  if (config.isDev) {
    await server.register(require('./plugins/logging'))
  }

  if (config.errbit.postErrors) {
    delete config.errbit.postErrors
    await server.register({
      plugin: require('node-hapi-airbrake'),
      options: config.errbit
    })
  }

  return server
}

module.exports = createServer
