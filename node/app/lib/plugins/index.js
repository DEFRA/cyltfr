var lout = require('lout')
var inert = require('inert')
var h2o2 = require('h2o2')
var views = require('./views')
var logging = require('./logging')

module.exports = function (server) {
  function registerCallback (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
  }

  // Register the common plugins:
  // statics, documentation, proxy
  server.register([inert, lout, h2o2], registerCallback)

  // Register the logging (good) plugin
  logging(server)

  // Register the view engine (vision) plugin
  views(server)
}
