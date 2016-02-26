var plugin = require('vision')
var handlebars = require('handlebars')
var layouts = require('handlebars-layouts')
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

    // Create the handlebars engine
    //  and register handlebars-layouts
    var engine = handlebars.create()
    layouts.register(engine)

    // Register global helpers
    var helpers = require('./helpers')
    for (var key in helpers) {
      if (helpers.hasOwnProperty(key)) {
        engine.registerHelper(key, helpers[key])
      }
    }

    server.views({
      engines: {
        html: engine
      },
      relativeTo: process.cwd(),
      path: 'views',
      partialsPath: 'views/partials',
      context: defaultContext
    })
  })
}
