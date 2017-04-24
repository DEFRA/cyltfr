var Glue = require('glue')
var handlebars = require('handlebars')
var manifest = require('./manifest')
var config = require('../config')
var analyticsAccount = config.analyticsAccount
var pkg = require('../package.json')
var appVersion = pkg.version
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
  floodWarningsUrl: config.floodWarningsUrl,
  phase: 'beta', // alpha or beta, blank is live and requires no phase banner
  feedback: true
}

var options = {
  relativeTo: __dirname
}

function composeServer (callback) {
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

        // Manually post the handled errors to errbit
        if (server.methods.hasOwnProperty('notify')) {
          if (!(response.data && response.data.isJoi) &&
            !(response.data && response.data.error && response.data.error.message.indexOf('postcode must') > -1)) {
            // Errbit doesn't separate deep nested objects, hence individual properties
            response.request_headers = request.headers
            response.request_info = request.info
            response.request_path = request.path
            response.request_params = request.params
            response.request_query = request.query
            server.methods.notify(response)
          }
        }

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
      } else if (response.statusCode === 302 && config.mountPath) {
        // If we are redirecting the reponse to a root relative and there's
        // a mount path, prepend the mount path to the redirection location.
        var location = response.headers.location
        if (location.startsWith('/')) {
          response.location('/' + config.mountPath + location.slice(1))
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

    callback(null, server)
  })
}

module.exports = composeServer
