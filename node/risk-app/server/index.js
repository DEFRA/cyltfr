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
    },
    router: {
      stripTrailingSlash: true
    }
  })

  const routeOptions = {
    routes: {
      prefix: config.mountPath && ('/' + config.mountPath)
    }
  }

  // Register the plugins
  await server.register(require('@hapi/h2o2'))
  await server.register(require('@hapi/inert'), routeOptions)
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'), routeOptions)
  // await server.register(require('./plugins/rate-limit'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/full-url'))
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

  if (config.mockAddressService) {
    require('../mock/address')
    server.log('info', 'Address server is being mocked')
  }

  return server
}

module.exports = createServer
