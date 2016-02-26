var server = require('./lib/server')

/*
 * Starts the server connections by listening for
 * incoming requests on the configured port of each listener
 */
server.start(function (err) {
  var details = {
    name: 'flood-risk-service',
    uri: server.info.uri
  }

  if (err) {
    details.error = err
    details.message = 'Failed to start ' + details.name
    server.log(['error', 'info'], details)
    throw err
  } else {
    details.message = 'Started ' + details.name
    server.log('info', details)
  }
})
