const config = require('../config')
const errors = require('../models/errors.json')

/*
* Add an `onPreResponse` listener to return error pages
*/

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            return h.view('404').code(statusCode)
          }

          // Log the error
          request.log('error', {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          })

          // In the event of 429
          // return the `429` view
          // if (statusCode === 429) {
          //   return h.view('429').code(statusCode)
          // }

          // The return the `500` view
          switch (response.message) {
            case errors.addressByPostcode.message:
            case errors.addressById.message:
              return h.view('500-address').code(statusCode)
            case errors.riskProfile.message:
            case errors.spatialQuery.message:
              return h.view('500-risk').code(statusCode)
            default:
              return h.view('500').code(statusCode)
          }
        } else if (response.statusCode === 302 && config.mountPath) {
          // If we are redirecting the response to a root relative and there's
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
}
