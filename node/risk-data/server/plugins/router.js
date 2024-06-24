const routes = [].concat(
  require('../routes/extra_info'),
  require('../routes/healthcheck')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _options) => {
      server.route(routes)
    }
  }
}
