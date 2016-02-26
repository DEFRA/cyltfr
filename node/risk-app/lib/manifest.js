var config = require('../config')

const manifest = {
  server: {
    connections: {
      routes: {
        //  Sets common security headers
        //  http://hapijs.com/api#route-options
        security: true
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
        register: 'vision'
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

module.exports = manifest
