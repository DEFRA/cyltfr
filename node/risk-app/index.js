const glue = require('@hapi/glue')
const config = require('./config')
const { manifest, options } = require('./server')

;(async () => {
  try {
    const server = await glue.compose(manifest, options)

    const cacheViews = config.cacheViews
    if (!cacheViews) {
      server.log('info', 'Handlebars views are not being cached')
    }

    if (config.mockAddressService) {
      require('./mock/address')
      server.log('info', 'Address server is being mocked')
    }

    await server.start()
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
})()
