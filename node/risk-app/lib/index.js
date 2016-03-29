var Glue = require('glue')
var handlebars = require('handlebars')
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
  floodWarningsUrl: config.floodWarningsUrl
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
   * Set is XMLHTTPrequest flag. Errors that occur
   * during Ajax requests are handled differently.
   * See `onPreResponse` below
   */
  server.ext('onRequest', function (request, reply) {
    request.xhr = request.headers['x-requested-with'] === 'XMLHttpRequest'
    return reply.continue()
  })

  /*
   * Handle route errors
   */
  server.ext('onPreResponse', function (request, reply) {
    var response = request.response

    if (response.isBoom) {
      // An error was raised during
      // processing the request
      var statusCode = response.output.statusCode

      // In the event of 404
      // return the `404` view
      if (!request.xhr && statusCode === 404) {
        return reply.view('404').code(statusCode)
      }

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })

      // The return the `500` view
      if (!request.xhr) {
        return reply.view('500').code(statusCode)
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
      details.message = 'Started ' + details.name
      server.log('info', details)
    }
  })
})
