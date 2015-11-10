var plugin = require('vision')
var handlebars = require('handlebars')
var config = require('config')
var pageRefreshTime = config.get('pageRefreshTime')

var defaultContext = {
  pageRefreshTime: pageRefreshTime,
  pageTitle: 'Long Term Flood Risk Information - GOV.UK',
  assetPath: '/public/',
  htmlLang: 'en',
  headerClass: 'with-proposition'
}

module.exports = function (server) {
  server.register(plugin, function (err) {
    if (err) {
      server.log('error', err)
      throw err
    }

    server.views({
      engines: {
        html: handlebars
      },
      relativeTo: process.cwd(),
      path: 'views',
      layout: 'govuk_template',
      layoutPath: 'views/layouts',
      partialsPath: 'views/partials',
      helpersPath: 'views/helpers',
      context: defaultContext
    })
  })
}
