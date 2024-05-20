const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')

let mockAddress

jest.mock('@hapi/yar', () => ({
  plugin: {
    name: '@hapi/yar',
    register: jest.fn(async (server, _options) => {
      server.decorate('request', 'yar', {
        set: jest.fn(),
        get: jest.fn(() => mockAddress)
      })
    })
  }
}))

jest.mock('../../services/risk', () => ({
  getByCoordinates: jest.fn().mockResolvedValue({
    riverAndSeaRisk: { probabilityForBand: 'high' }
  })
}))

describe('GET /rivers-and-sea', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  afterAll(async () => {
    await server.stop()
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })

  it('redirects to postcode page if user does not have an address set in session', async () => {
    mockAddress = undefined

    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }

    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(response.headers.location).toBe('/postcode')
  })

  it('returns 200 OK and renders view if user has an address set in session', async () => {
    mockAddress = { x: 123, y: 123 }

    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }

    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.result).toContain('rivers-and-sea') 
  })
})
