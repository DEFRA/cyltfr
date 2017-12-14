const config = require('./config')
const composeServer = require('./server')
const pkg = require('./package.json')
const appName = pkg.name
const appVersion = pkg.version

// There's no callee so we're running
// normally and will compose and start a server
if (!module.parent) {
  composeServer()
    .then(async server => {
      /**
       * Start the server
       */
      const details = {
        name: appName,
        version: appVersion,
        uri: server.info.uri
      }

      try {
        await server.start()

        if (config.mockAddressService) {
          require('./mock/address')
          server.log('info', 'External requests are being mocked')
        }

        details.message = 'Started ' + details.name
        server.log('info', details)
        console.info(details.message)
      } catch (err) {
        details.error = err
        details.message = 'Failed to start ' + details.name
        server.log(['error', 'info'], details)
        throw err
      }
    })
    .catch(err => {
      throw err
    })
} else {
  module.exports = composeServer
}
