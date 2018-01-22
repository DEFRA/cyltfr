const composeServer = require('./server')
const pkg = require('./package.json')
const appName = pkg.name
const appVersion = pkg.version

if (!module.parent) {
  // There's no callee so we're running
  // normally and will compose and start a server
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
  // There's a callee so we're probably running a test.
  // In which case just export the compose server function
  module.exports = composeServer
}
