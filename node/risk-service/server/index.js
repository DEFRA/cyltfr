var Glue = require('glue')
var manifest = require('./manifest')
var routes = require('./routes')

var options = {
  relativeTo: __dirname
}

function composeServer (callback) {
  Glue.compose(manifest, options, function (err, server) {
    if (err) {
      throw err
    }

    /*
    * Register routes
    */
    server.route(routes)

    /*
    * Handle route errors
    */
    server.ext('onPreResponse', function (request, reply) {
      var response = request.response

      if (response.isBoom) {
        // An error was raised during
        // processing the request
        var statusCode = response.output.statusCode

        request.log('error', {
          statusCode: statusCode,
          data: response.data,
          message: response.message
        })
      }
      return reply.continue()
    })

    callback(null, server)
  })
}

module.exports = composeServer
