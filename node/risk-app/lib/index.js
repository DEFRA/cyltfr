var Glue = require('glue')
var handlebars = require('handlebars')
var layouts = require('handlebars-layouts')
var manifest = require('./manifest')
var routes = require('./routes')
var config = require('../config')
var pageRefreshTime = config.pageRefreshTime
var analyticsAccount = config.analyticsAccount
var appVersion = require('../package.json').version
var appName = require('../package.json').name

var defaultContext = {
  globalHeaderText: 'GOV.UK',
  pageTitle: 'Long Term Flood Risk Information - GOV.UK',
  skipLinkMessage: 'Skip to main content',
  homepageUrl: 'https://www.gov.uk/',
  logoLinkTitle: 'Go to the GOV.UK homepage',
  crownCopyrightMessage: '© Crown copyright',
  assetPath: '/public/',
  htmlLang: 'en',
  headerClass: 'with-proposition',
  pageRefreshTime: pageRefreshTime,
  analyticsAccount: analyticsAccount,
  appVersion: appVersion,
  appName: appName
}

var options = {
  relativeTo: __dirname
}

Glue.compose(manifest, options, function (err, server) {
  if (err) {
    throw err
  }

  server.route(routes)

  /*
   * Handle route errors
   */
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

  /*
  * Create the handlebars engine
  */
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

  server.start(function (err) {
    var details = {
      name: 'ltfri-app',
      uri: server.info.uri
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      server.log(['error', 'info'], details)
      throw err
    } else {
      details.message = 'Started ' + details.name
      server.log('info', details)
    }
  })
})
