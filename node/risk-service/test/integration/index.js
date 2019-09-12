const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const glupe = require('@hapi/glue')
const lab = exports.lab = Lab.script()
const { manifest, options } = require('../../server')

lab.experiment('Integration', () => {
  let server

  // Make a server before the tests
  lab.before(async () => {
    console.log('Creating server')
    server = await glupe.compose(manifest, options)
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  const urls = [
    '/floodrisk/391416/102196/20'
  ]

  urls.forEach((url) => {
    lab.test(url, async () => {
      const options = {
        method: 'GET',
        url: url
      }

      const response = await server.inject(options)
      Code.expect(response.statusCode).to.equal(200)
    })
  })
})
