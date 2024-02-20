const hapi = require('@hapi/hapi')
const config = require('./config')
const cache = require('./cache')
const sndPassword = require('./services/snd-password')

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
  await server.register(require('./plugins/rate-limit'))
  await server.register(require('./plugins/error-pages'))
  await server.register(require('./plugins/full-url'))
  await server.register(require('./plugins/logging'))
  await server.register(require('./plugins/session'))
  await server.register(require('./plugins/cookies'))
  await server.register(require('blipp'))
  await server.register(require('@hapi/cookie'))
  sndPassword.server = server

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'floodsandbox',
      password: config.authcookie.cookiepassword,
      isSecure: config.authcookie.secure
    },
    redirectTo: '/login',
    validate: sndPassword.validate
  })

  await server.register(require('./plugins/router'))

  if (config.mockAddressService) {
    require('../mock/address')
    server.log('info', 'Address server is being mocked')
  }
  if (config.errbit.postErrors) {
    await server.register({
      plugin: require('./plugins/airbrake'),
      options: config.errbit.options
    })
  }
  return server
}

module.exports = createServer
