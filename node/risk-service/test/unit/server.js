const Glue = require('glue')
const manifest = require('./manifest')
const routes = require('../../server/routes')

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
  * Mock pg client
  */
  server.ext('onPreHandler', (request, h) => {
    request.pg = {
      client: {
        query: (var1, var2) => {
          return Promise.reject(new Error('Database Error'))
        }
      },
      kill: false
    }

    return h.continue
  })

  return server
}

module.exports = composeServer
