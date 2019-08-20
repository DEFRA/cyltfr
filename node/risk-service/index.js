const glue = require('@hapi/glue')
const { manifest, options } = require('./server')

;(async () => {
  try {
    const server = await glue.compose(manifest, options)
    await server.start()
  } catch (err) {
    console.error('Failed to start server', err)
    process.exit(1)
  }
})()
