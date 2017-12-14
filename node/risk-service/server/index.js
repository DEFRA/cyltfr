const Glue = require('glue')
const manifest = require('./manifest')
const routes = require('./routes')

const options = {
  relativeTo: __dirname
}

async function composeServer () {
  const server = await Glue.compose(manifest, options)

  /*
  * Register routes
  */
  server.route(routes)

  /*
  * Handle route errors
  */
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

  return server
}

module.exports = composeServer
