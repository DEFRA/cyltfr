const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')

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

jest.mock('../../services/risk')

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
    riskService.__resetReturnValue()
    jest.clearAllMocks()
  })

  it('redirects to postcode page if user does not have an address set in session', async () => {
    mockAddress = undefined

    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }
    riskService.__updateReturnValue({ riverAndSeaRisk: { probabilityForBand: 'high' } })
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(response.headers.location).toBe('/postcode')
  })

  it('returns 200 OK and renders rivers and sea page if user has an address set in session', async () => {
    mockAddress = { x: 123, y: 123 }

    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }

    riskService.__updateReturnValue({ riverAndSeaRisk: { probabilityForBand: 'high' } })

    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.result).toContain('rivers-and-sea')
  })

  it('should show an error page if an error occurs', async () => {
    mockAddress = { x: 123, y: 123 }

    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }

    riskService.__updateReturnValue(() => {
      throw new Error('User not found')
    })

    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })
})
