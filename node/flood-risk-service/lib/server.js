var Hapi = require('hapi')
var config = require('config')
var options = config.get('server')
var loadPlugins = require('./plugins')
var routes = require('./routes')
var server = new Hapi.Server()

/*
 * Server connection
 */
server.connection(options)

/*
 * Register plugins
 */
loadPlugins(server)

/*
 * Register routes
 */
server.route(routes)

module.exports = server
