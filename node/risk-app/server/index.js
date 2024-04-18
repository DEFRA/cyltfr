const hapi = require('@hapi/hapi')
const config = require('./config')
const cache = require('./cache')

async function createServer () {
  // Create the hapi server
  const server = hapi.server({
    host: config.host,
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false,
          stripUnknown: true
        }
      },
      security: true
    },
    router: {
      stripTrailingSlash: true
    },
    cache
  })

  // Register the plugins
  await server.register(require('@hapi/h2o2'))
  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/rate-limit'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/full-url'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/cookies'))
  await server.register(require('blipp'))

  if (config.errbit.postErrors) {
    await server.register({
      plugin: require('./plugins/airbrake'),
      options: config.errbit.options
    })
  }
  return server
}

module.exports = createServer
