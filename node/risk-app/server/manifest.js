const viewsOptions = require('./views')
const config = require('../config')
const routeOptions = {}

// Mount point
if (config.mountPath) {
  routeOptions.routes = {
    prefix: '/' + config.mountPath
  }
}

const manifest = {
  server: {
    port: config.server.port,
    host: config.server.host,
    routes: {
      //  Sets common security headers
      //  http://hapijs.com/api#route-options
      security: true,
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  },
  register: {
    plugins: [
      {
        plugin: 'inert'
      },
      {
        plugin: 'vision',
        options: viewsOptions
      },
      {
        plugin: 'h2o2'
      },
      {
        plugin: 'good',
        options: config.logging
      },
      {
        plugin: './router',
        options: routeOptions,
        routes: {
          prefix: config.mountPath && ('/' + config.mountPath)
        }
      }
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
