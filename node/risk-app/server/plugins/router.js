const routes = [].concat(
  require('../routes/home'),
  require('../routes/describe-risk'),
  require('../routes/postcode'),
  require('../routes/address'),
  require('../routes/england-only'),
  require('../routes/risk'),
  require('../routes/map'),
  require('../routes/confirmation'),
  require('../routes/public'),
  require('../routes/gwc-proxy'),
  require('../routes/os-get-capabilities'),
  require('../routes/feedback'),
  require('../routes/os-terms'),
  require('../routes/geocode')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
