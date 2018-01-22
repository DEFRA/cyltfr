const glupe = require('glupe')
const config = require('./config')
const { manifest, options } = require('./server')

;(async () => {
  try {
    const server = await glupe(manifest, options)
    const cacheViews = config.cacheViews
    if (!cacheViews) {
      server.log('info', 'Handlebars views are not being cached')
    }

    if (config.mockAddressService) {
      require('./mock/address')
      server.log('info', 'Address server is being mocked')
    }
  } catch (err) {
    console.error(err)
  }
})()
