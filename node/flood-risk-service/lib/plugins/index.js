var lout = require('lout')
var inert = require('inert')
var vision = require('vision')
var logging = require('./logging')
var postgres = require('./postgres')

module.exports = function (server) {
  function registerCallback (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
  }

  // Register the common plugins
  server.register([inert, vision, lout], registerCallback)

  // Register the logging (good) plugin
  logging(server)

  // Register the postgres db plugin
  postgres(server)
}
