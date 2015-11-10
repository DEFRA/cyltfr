var plugin = require('hapi-mongodb')
var Config = require('config')

module.exports = function (server, startServerCallback) {
  var errHandler = function (err) {
    if (err) {
      console.log('error', err)
      throw err
    }
    startServerCallback(server)
  }

  server.register({
    register: plugin,
    options: Config.get('database')
  }, errHandler)
}
