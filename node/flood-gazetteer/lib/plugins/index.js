var logging = require('./logging')
var mongodb = require('./mongodb')

module.exports = function (server, startServerCallback) {
  // Register the logging (good) plugin
  logging(server)

  mongodb(server, startServerCallback)
}
