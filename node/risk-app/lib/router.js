var routes = require('./routes')

var register = function (server, options, next) {
  server.route(routes)
  next()
}

register.attributes = {
  name: 'router'
}

module.exports = register
