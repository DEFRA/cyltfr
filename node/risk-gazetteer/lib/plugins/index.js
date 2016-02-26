var lout = require('lout')
var inert = require('inert')
var vision = require('vision')
var logging = require('./logging')
var mongodb = require('./mongodb')

module.exports = function (server, startServerCallback) {
  server.register([inert, vision, lout], function (err) {
    if (err) {
      server.log('error', err)
      throw err
    }
  })

  // Register the logging (good) plugin
  logging(server)

  mongodb(server, startServerCallback)
}
