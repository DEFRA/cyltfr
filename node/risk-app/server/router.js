const routes = require('./routes')

exports.plugin = {
  register: (server, options) => {
    server.route(routes)
  },
  pkg: require('../package.json')
}
