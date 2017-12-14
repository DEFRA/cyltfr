const Glue = require('glue')
const manifest = require('./manifest')
const config = require('../config')
const errors = require('./models/errors.json')

const options = {
  relativeTo: __dirname
}

async function composeServer () {
  const server = await Glue.compose(manifest, options)

  /*
   * Handle route errors
   */
  server.ext('onPreResponse', function (request, h) {
    const response = request.response

    if (response.isBoom) {
      // An error was raised during
      // processing the request
      const statusCode = response.output.statusCode
      const useErrorPages = request.route.settings.app.useErrorPages !== false

      // In the event of 404
      // return the `404` view
      if (useErrorPages && statusCode === 404) {
        return h.view('404').code(statusCode)
      }

      request.log('error', {
        statusCode: statusCode,
        data: response.data,
        message: response.message
      })

      // The return the `500` view
      if (useErrorPages) {
        switch (response.message) {
          case errors.addressByPremisesAndPostcode.message:
          case errors.addressById.message:
            return h.view('500-address').code(statusCode)
          case errors.riskProfile.message:
          case errors.spatialQuery.message:
            return h.view('500-risk').code(statusCode)
          default:
            return h.view('500').code(statusCode)
        }
      }
    } else if (response.statusCode === 302 && config.mountPath) {
      // If we are redirecting the reponse to a root relative and there's
      // a mount path, prepend the mount path to the redirection location.
      const location = response.headers.location
      if (location.startsWith('/')) {
        response.location('/' + config.mountPath + location)
      }
    }
    return h.continue
  })

  /*
   * Add full url to context of view for opengraph meta property
   */
  server.ext('onPostHandler', function (request, h) {
    if (request.response.variety === 'view') {
      let fullUrl = config.floodRiskUrl + (request.path !== '/' ? request.path : '')
      if (request.query) {
        Object.keys(request.query).forEach(function (key, index) {
          fullUrl += (index === 0 ? '?' : '&') + key + '=' + request.query[key]
        })
      }

      if (request.response.source.context) {
        request.response.source.context.fullUrl = encodeURI(fullUrl)
      } else {
        request.response.source.context = {
          fullUrl: encodeURI(fullUrl)
        }
      }
    }
    return h.continue
  })

  const cacheViews = config.cacheViews
  if (!cacheViews) {
    server.log('info', 'Handlebars views are not being cached')
  }

  return server
}

module.exports = composeServer
