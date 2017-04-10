var config = require('./config')
var composeServer = require('./server')
var pkg = require('./package.json')
var appName = pkg.name

// There's no callee so we're running
// normally and will compose and start a server
if (!module.parent) {
  composeServer(function (err, server) {
    if (err) {
      throw err
    }

    /*
     * Start the server
     */
    server.start(function (err) {
      var details = {
        name: appName,
        uri: server.info.uri
      }

      if (err) {
        details.error = err
        details.message = 'Failed to start ' + details.name
        server.log(['error', 'info'], details)
        throw err
      } else {
        if (config.mockExternalHttp) {
          require('./mock')
          server.log('info', 'External requests are being mocked')
        }

        details.config = config
        details.message = 'Started ' + details.name
        server.log('info', details)
        console.info(details.message)
      }
    })
  })
} else {
  module.exports = composeServer
}

