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
          const useErrorPages = request.route.settings.app.useErrorPages !== false

          if (useErrorPages) {
            // In the event of 401
            // return the `401` view
            if (statusCode === 401) {
              return h.view('401').code(200)
            }

            // In the event of 403
            // return the `403` view
            if (statusCode === 403) {
              return h.view('403').code(200)
            }

            // In the event of 404
            // return the `404` view
            if (statusCode === 404) {
              return h.view('404').code(200)
            }
          }

          request.log('error', {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          })

          if (useErrorPages) {
            // The return the `500` view
            return h.view('500').code(200)
          }
        }

        return h.continue
      })
    }
  }
}
