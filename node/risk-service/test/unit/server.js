var Glue = require('glue')
var manifest = require('./manifest')
var routes = require('../../server/routes')

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
    * Mock pg client
    */
    server.ext('onPreHandler', function (request, reply) {
      request.pg = {
        client: {
          query: (var1, var2, callback) => {
            process.nextTick(() => {
              callback(new Error('database error'), null)
            })
          }
        },
        kill: false
      }
      return reply.continue()
    })

    callback(null, server)
  })
}

module.exports = composeServer
