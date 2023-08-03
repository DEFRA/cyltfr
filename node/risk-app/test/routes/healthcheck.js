const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { payloadMatchTest } = require('../utils')

lab.experiment('Healthcheck test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('Assert Healthcheck page', async () => {
    const options = {
      method: 'GET',
      url: '/healthcheck',
      headers: {

      }
    }
    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /ok/g)
  })
})
