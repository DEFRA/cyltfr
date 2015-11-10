require('./lib/server')(startServerCallback)

function startServerCallback (server) {
  server.start(function (err) {
    var details = {
      name: 'flood-gazetteer',
      uri: server.info.uri
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      console.log(['error', 'info'], details)
      throw err
    } else {
      details.message = 'Started ' + details.name
      console.log('info', details)
    }
  })
}
