var config = require('../../config').geoserver

module.exports = {
  method: 'GET',
  path: '/geoserver/{path*}',
  handler: {
    proxy: {
      host: config.host,
      port: config.port,
      protocol: config.protocol,
      passThrough: true
    }
  }
}
