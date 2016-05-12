var Glue = require('glue')
var handlebars = require('handlebars')
var manifest = require('./manifest')
var config = require('../config')
var analyticsAccount = config.analyticsAccount
var pkg = require('../package.json')
var appVersion = pkg.version
var appName = pkg.name
var errors = require('./models/errors.json')
var mountPath = config.mountPath ? '/' + config.mountPath + '/' : '/'
var assetPath = mountPath + 'public/'

var defaultContext = {
  globalHeaderText: 'GOV.UK',
  pageTitle: 'Long Term Flood Risk Information - GOV.UK',
  skipLinkMessage: 'Skip to main content',
  homepageUrl: 'https://www.gov.uk/',
  logoLinkTitle: 'Go to the GOV.UK homepage',
  crownCopyrightMessage: '© Crown copyright',
  mountPath: mountPath,
  assetPath: assetPath,
  htmlLang: 'en',
  headerClass: 'with-proposition',
  analyticsAccount: analyticsAccount,
  appVersion: appVersion,
  floodWarningsUrl: config.floodWarningsUrl
}

var options = {
  relativeTo: __dirname
}

Glue.compose(manifest, options, function (err, server) {
  if (err) {
    throw err
  }

  /*
   * Handle route errors
   */
  server.ext('onPreResponse', function (request, reply) {
    var response = request.response

    if (response.isBoom) {
      // An error was raised during
      // processing the request
      var statusCode = response.output.statusCode
      var useErrorPages = request.route.settings.app.useErrorPages !== false

      // In the event of 404
      // return the `404` view
      if (useErrorPages && statusCode === 404) {
        return reply.view('404').code(statusCode)
      }

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })

      // The return the `500` view
      if (useErrorPages) {
        switch (response.message) {
          case errors.addressByPostcode.message:
          case errors.addressById.message:
            return reply.view('500-address').code(statusCode)
          case errors.riskProfile.message:
          case errors.spatialQuery.message:
            return reply.view('500-risk').code(statusCode)
          default:
            return reply.view('500').code(statusCode)
        }
      }
    }
    return reply.continue()
  })

  /*
   * Create the handlebars engine
   */
  var engine = handlebars.create()

  var helpers = require('./helpers')
  for (var key in helpers) {
    if (helpers.hasOwnProperty(key)) {
      engine.registerHelper(key, helpers[key])
    }
  }

  var cacheViews = config.cacheViews
  if (!cacheViews) {
    server.log('info', 'Handlebars views are not being cached')
  }

  server.views({
    engines: {
      html: engine
    },
    relativeTo: process.cwd(),
    path: 'views',
    partialsPath: 'views/partials',
    context: defaultContext,
    layout: true,
    isCached: cacheViews
  })

  /*
   * Start the server
   */
  server.start(function (err) {
    var details = {
      name: appName,
      uri: server.info.uri
    }

    if (err) {
      details.error = err
      details.message = 'Failed to start ' + details.name
      server.log(['error', 'info'], details)
      throw err
    } else {
      if (config.mockAddressService) {
        // Mock Address service
        require('../mock/address')
        server.log('info', 'Address service requests are being mocked')
      }

      details.config = config
      details.message = 'Started ' + details.name
      server.log('info', details)
      console.info(details.message)
    }
  })
})
