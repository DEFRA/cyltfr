const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')

jest.mock('@hapi/yar', () => ({
  plugin: {
    name: '@hapi/yar',
    register: jest.fn(async (server, options) => {
      server.decorate('request', 'yar', {
        set: jest.fn(),
        get: jest.fn(() => {
          return {
            address: {
              x: 360948.42,
              y: 387764.37
            }
          }
        })
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
      url: '/rivers-and-sea',
      payload: {
        address: {
          x: 360948.42,
          y: 387764.37
        }
      }
    }

    const mockResponse = { riverAndSeaRisk: { probabilityForBand: 'high' } }
    riskService.getByCoordinates.mockResolvedValue(mockResponse)
    const response = await server.inject(mockRequest)
    const { payload } = response

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(payload).toMatch(/Rivers and the sea: understand your flood risk/g)
  })

  // it('redirects to /postcode if address is not set in session', async () => {
  //   const request = {
  //     method: 'GET',
  //     url: '/rivers-and-sea',
  //     yar: {
  //       get: jest.fn().mockReturnValue(null)
  //     }
  //   }

  //   const response = await server.inject(request)

  //   expect(response.statusCode).toBe(302)
  //   expect(response.headers.location).toBe('/postcode')
  // })

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
