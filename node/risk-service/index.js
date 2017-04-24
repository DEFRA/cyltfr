var config = require('./config')
var composeServer = require('./server')
var pkg = require('./package.json')
var appName = pkg.name
var appVersion = pkg.version

if (!module.parent) {
  // There's no callee so we're running
  // normally and will compose and start a server
  composeServer(function (err, server) {
    if (err) {
      throw err
    }

    /**
     * Start the server
     */
    server.start(function (err) {
      var details = {
        name: appName,
        version: appVersion,
        uri: server.info.uri
      }

      if (err) {
        details.error = err
        details.message = 'Failed to start ' + details.name
        server.log('error', details)
        throw err
      } else {
        details.config = config
        details.message = 'Started ' + details.name
        server.log('info', details)
        console.info(details.message)
      }
    })
  })
} else {
  // There's a callee so we're probably running a test.
  // In which case just export the compose server function
  module.exports = composeServer
}

