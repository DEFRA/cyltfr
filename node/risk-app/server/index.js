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

  // Register the plugins
  await server.register(require('@hapi/inert'), {
    routes: {
      prefix: config.mountPath && ('/' + config.mountPath)
    }
  })
  await server.register(require('./plugins/views'))
  await server.register(require('./plugins/router'), {
    routes: {
      prefix: config.mountPath && ('/' + config.mountPath)
    }
  })
  await server.register(require('./plugins/rate-limit'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('blipp'))

  if (config.isDev) {
    await server.register(require('./plugins/logging'))
  }

  return server
}

module.exports = createServer
