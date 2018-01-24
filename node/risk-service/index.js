const glupe = require('glupe')
const { manifest, options } = require('./server')

;(async () => {
  try {
    await glupe(manifest, options)
  } catch (err) {
    process.exit(1)
    console.error(err)
  }
})()
