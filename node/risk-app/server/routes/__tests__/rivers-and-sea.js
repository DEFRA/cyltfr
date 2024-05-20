const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')
const mockYar = require('@hapi/yar')

console.log(mockYar.plugin.register)

jest.mock('@hapi/yar', () => ({
  plugin: {
    name: '@hapi/yar',
    register: jest.fn(async (server, _options) => {
      server.decorate('request', 'yar', {
        set: jest.fn(),
        get: jest.fn()
      })
    })
  }
}))

jest.mock('../../services/risk', () => ({
  getByCoordinates: jest.fn()
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

  it('returns view with model if risk data is retrieved successfully', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }

    mockYar.plugin.register.mockImplementationOnce(() => {
      return { address: { x: 123, y: 123 } }
    })

    console.log(mockYar)

    const mockResponse = { riverAndSeaRisk: { probabilityForBand: 'high' } }
    riskService.getByCoordinates.mockResolvedValue(mockResponse)
    const response = await server.inject(mockRequest)
    const { payload } = response

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(payload).toMatch(/Rivers and the sea: understand your flood risk/g)
  })

  it('redirects to postcode page if user does not have an address set in session', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea'
    }
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(response.headers.location).toBe('/postcode')
  })

  // it('returns 400 if there is an error retrieving risk data', async () => {
  //   const address` = { x: 1, y: 2 }

  //   riskService.getByCoordinates.mockRejectedValue(new Error('test error'))

  //   const request = {
  //     method: 'GET',
  //     url: '/rivers-and-sea',
  //     yar: {
  //       get: jest.fn().mockReturnValue(address)
  //     }
  //   }

  //   const response = await server.inject(request)

  //   expect(response.statusCode).toBe(400)
  //   expect(response.result.message).toBe(errors.riskProfile.message)
  // })
})
