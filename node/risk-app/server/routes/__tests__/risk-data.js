const createServer = require('../../../server')
let server

beforeAll(async () => {
  server = await createServer()
  await server.initialize()
})

afterAll(async () => {
  await server.stop()
})

describe('risk data page', () => {
  it('gets the risk data page with an 200OK', async () => {
    const options = {
      method: 'GET',
      url: '/risk-data'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(200)
  })
})
