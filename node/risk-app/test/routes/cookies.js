const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { payloadMatchTest } = require('../utils')

lab.experiment('Cookie page test', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('get cookies page', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(response.payload, /We use cookies to make Check your long term flood risk work/g)
  })

  lab.test('post cookie update', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      payload: 'analytics=true'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
  })

  lab.test('post async cookie update', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      payload: 'analytics=true&async=true'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(response.payload, /ok/g)
  })
})
