const glue = require('@hapi/glue')
const { manifest, options } = require('./server')

;(async () => {
  const server = await glue.compose(manifest, options)
  const info = {}

  try {
    // Start the server
    await server.start()

    // Log server start
    info.uri = server.info.uri
    info.message = 'Started server'

    server.log('info', info)
    console.info(info.message, info.uri)

    return server
  } catch (err) {
    // Log server error
    info.err = err
    info.message = 'Failed to start server'

    server.log(['error', 'info'], info)
    console.error(info.message, err)
    console.log('Exiting process')

    process.exit(1)
  }
})()
