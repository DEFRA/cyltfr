const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { payloadMatchTest } = require('../utils')

lab.experiment('Map page test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('Assert Map page', async () => {
    const options = {
      method: 'GET',
      url: '/map?easting=1&northing=1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(response.payload, /Select the type of flood risk information you're interested in\. The map will then update\./g)
  })
})