var gsConfig = require('config').get('geoserver')

module.exports = {
  method: 'GET',
  path: '/geoserver/{path*}',
  handler: {
    proxy: {
      host: gsConfig.host,
      port: gsConfig.port,
      protocol: gsConfig.protocol,
      passThrough: true
    }
  }
}
