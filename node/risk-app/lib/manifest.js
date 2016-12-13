var config = require('../config')
var routeOptions = {}

// Mount point
if (config.mountPath) {
  routeOptions.routes = {
    prefix: '/' + config.mountPath
  }
}

const manifest = {
  server: {
    connections: {
      routes: {
        //  Sets common security headers
        //  http://hapijs.com/api#route-options
        security: true
      },
      router: {
        stripTrailingSlash: true
      }
    }
  },
  connections: [
    {
      port: config.server.port,
      host: config.server.host
    }
  ],
  registrations: [
    {
      plugin: {
        register: 'inert'
      }
    },
    {
      plugin: {
        register: 'vision'
      }
    },
    {
      plugin: {
        register: 'lout'
      }
    },
    {
      plugin: {
        register: 'h2o2'
      }
    },
    {
      plugin: {
        register: 'good',
        options: config.logging
      }
    },
    {
      plugin: {
        register: './router'
      },
      options: routeOptions
    }
  ]
}

module.exports = manifest
