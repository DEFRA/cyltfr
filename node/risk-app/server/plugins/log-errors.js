const config = require('../../config')
const errors = require('../models/errors.json')

/*
* Add an `onPreResponse` listener to log request errors
*/
exports.plugin = {
  name: 'log-errors',
  register: (server, options) => {
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
  }
}
