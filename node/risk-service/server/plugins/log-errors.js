/*
* Add an `onPreResponse` listener to log request errors
*/
exports.plugin = {
  name: 'log-errors',
  register: (server, options) => {
    server.ext('onPreResponse', (request, h) => {
      const response = request.response

      if (response.isBoom) {
        // An error was raised during
        // processing the request
        const statusCode = response.output.statusCode

        request.log('error', {
          statusCode: statusCode,
          data: response.data,
          message: response.message
        })
      }

      return h.continue
    })
  }
}
