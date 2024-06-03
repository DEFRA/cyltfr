const createServer = require('../../../server')
const config = require('../../config')

jest.mock('../../config')

describe('server methods', () => {
  let server

  beforeAll(async () => {
    config.setConfigOptions({ enableCache: true })
    server = await createServer()
  })

  test('find method should return cached result', async () => {
    const response = await server.methods.find('some address')
    expect(response).toBeDefined()
  })

  test('riskService method should return cached result', async () => {
    const response = await server.methods.riskService(40.7128, -74.0060)
    expect(response).toBeDefined()
  })
})

describe('server methods without cache', () => {
  let server

  beforeAll(async () => {
    config.setConfigOptions({ enableCache: true })
    server = await createServer()
  })

  test('find method should work without cache', async () => {
    const response = await server.methods.find('some address')
    expect(response).toBeDefined()
  })

  test('riskService method should work without cache', async () => {
    const response = await server.methods.riskService(40.7128, -74.0060)
    expect(response).toBeDefined()
  })
})
