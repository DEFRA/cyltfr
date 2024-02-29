const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const STATUS_CODES = require('http2').constants

lab.experiment('Unit', () => {
  let server

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('/', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_MOVED_PERMANENTLY) // 301
  })

  lab.test('/os-terms', async () => {
    const options = {
      method: 'GET',
      url: '/os-terms'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK) // 200
  })

  lab.test('Ignore unknown cookies', async () => {
    const options = {
      method: 'GET',
      url: '/cookies',
      headers: {
        cookie: 'some-token=<token>'
      }
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK) // 200
  })

  lab.test('Managing flood risk redirects to Prepare for flooding', async () => {
    const options = {
      method: 'GET',
      url: '/managing-flood-risk'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_MOVED_PERMANENTLY) // 301
  })
})
