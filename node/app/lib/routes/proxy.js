var config = require('config').get('geoserver')

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
