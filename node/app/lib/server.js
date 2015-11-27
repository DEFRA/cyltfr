var Hapi = require('hapi')
var config = require('config')
var options = config.get('server')
var loadPlugins = require('./plugins')
var routes = require('./routes')
var server = new Hapi.Server()

/*
 * Server connection
 */
server.connection({
  port: options.port,
  host: options.host
})

/*
 * Register plugins
 */
loadPlugins(server)

/*
 * Register routes
 */
server.route(routes)

server.ext('onPreResponse', function (request, reply) {
  if (request.response) {
    if (request.response.isBoom) {
      // If an error was raised during
      // processing the request, return a 500 view
      var err = request.response
      var errName = 'An error occured'
      var statusCode = err.output.statusCode

      return reply.view('500', {
        statusCode: statusCode,
        errName: errName
      }).code(statusCode)
    }
  }
  return reply.continue()
})

module.exports = server
