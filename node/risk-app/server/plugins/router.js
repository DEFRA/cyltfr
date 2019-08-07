const routes = [].concat(
  require('../routes/home'),
  require('../routes/describe-risk'),
  require('../routes/postcode'),
  require('../routes/address'),
  require('../routes/england-only'),
  require('../routes/risk-summary'),
  require('../routes/public')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
