var plugin = require('hapi-node-postgres')
var config = require('config')
var options = config.get('database')

module.exports = function (server) {
  function registerCallback (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
  }

  server.register({
    register: plugin,
    options: options
  }, registerCallback)
}
