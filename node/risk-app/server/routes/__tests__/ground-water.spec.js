const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')
const { getByCoordinates } = require('../../services/risk')
const config = require('../../config')
const groundWater = require('../ground-water')

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

describe('GET /ground-water', () => {
  let server
  let h
  let request

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
  })

  beforeEach(async () => {
    request = {
      yar: {
        get: jest.fn().mockReturnValue({ x: 123, y: 456 })
      }
    }

    h = {
      view: jest.fn()
    }
    config.riskPageFlag = true
  })

  afterAll(async () => {
    await server.stop()
  })

  afterEach(async () => {
    riskService.__resetReturnValue()
    jest.clearAllMocks()
  })

  it('throws an error if the risk page flag is not set, disallowing access to page', async () => {
    mockAddress = { x: 123, y: 123 }
    const mockRequest = {
      method: 'GET',
      url: '/ground-water'
    }
    config.riskPageFlag = false
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FORBIDDEN)
  })

  it('redirects to postcode page if user does not have an address set in session', async () => {
    mockAddress = null
    const mockRequest = {
      method: 'GET',
      url: '/ground-water'
    }
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(response.headers.location).toBe('/postcode')
  })

  it('returns 200 OK and renders rivers and sea page if user has an address set in session', async () => {
    mockAddress = { x: 123, y: 123 }
    const mockRequest = {
      method: 'GET',
      url: '/ground-water'
    }
    riskService.__updateReturnValue({ riverAndSeaRisk: { probabilityForBand: 'high' } })
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.result).toContain('ground-water')
  })

  it('should show an error page if an error occurs', async () => {
    mockAddress = { }
    const mockRequest = {
      method: 'GET',
      url: '/ground-water'
    }
    getByCoordinates.mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  it.only('should create an array of reservoirs if there is a reservoirs risk', async () => {
    riskService.getByCoordinates.mockResolvedValue({
      reservoirDryRisk: [{
        reservoirName: 'Dry Risk Resevoir',
        location: 'SJ917968',
        riskDesignation: 'High-risk',
        undertaker: 'United Utilities PLC',
        leadLocalFloodAuthority: 'Tameside',
        comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
      }],
      reservoirWetRisk: [{
        reservoirName: 'Wet risk reservoir',
        location: 'SJ917968',
        riskDesignation: 'High-risk',
        undertaker: 'United Utilities PLC',
        leadLocalFloodAuthority: 'Tameside',
        comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
      }]
    })

    const handler = groundWater.handler
    await handler(request, h)

    expect(h.view).toHaveBeenCalledWith(
      'ground-water',
      expect.objectContaining({
        reservoirs: [{
            reservoirName: 'Dry Risk Resevoir',
            location: 'SJ917968',
            riskDesignation: 'High-risk',
            undertaker: 'United Utilities PLC',
            leadLocalFloodAuthority: 'Tameside',
            comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
          }]
        }
      )
    )
  })
})
