var plugin = require('hapi-mongodb')
var config = require('config')

module.exports = function (server, startServerCallback) {
  function errHandler (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
    startServerCallback(server)
  }

  server.register({
    register: plugin,
    options: config.get('database')
  }, errHandler)
}
