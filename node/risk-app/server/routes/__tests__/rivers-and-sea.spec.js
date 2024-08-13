const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')
const { getByCoordinates } = require('../../services/risk')
const config = require('../../config')
const { mockOptions, mockSearchOptions } = require('../../../test/mock')
const defaultOptions = {
  method: 'GET',
  url: '/risk'
}

jest.mock('../../config')
jest.mock('../../services/flood')
jest.mock('../../services/address')
jest.mock('../../services/risk')

let server, cookie

function checkCookie (response) {
  if (response.headers['set-cookie']) {
    cookie = response.headers['set-cookie'][0].split(';')[0]
    defaultOptions.headers = { cookie }
  }
}

describe('GET /rivers-and-sea - flag enabled', () => {
  beforeAll(async () => {
    config.setConfigOptions({
      friendlyCaptchaEnabled: false
    })
    server = await createServer()
    await server.initialize()
    const initial = mockOptions()

    const homepageresponse = await server.inject(initial)
    expect(homepageresponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    checkCookie(homepageresponse)
  })

  beforeEach(async () => {
    const { getOptions, postOptions } = mockSearchOptions('NP18 3EZ', cookie)
    let postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch(`/search?postcode=${encodeURIComponent('NP18 3EZ')}`)

    const getResponse = await server.inject(getOptions)
    checkCookie(getResponse)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    postOptions.url = `/search?postcode=${encodeURIComponent('NP18 3EZ')}`
    postOptions.payload = 'address=0'

    postResponse = await server.inject(postOptions)
    checkCookie(postResponse)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch('/risk')
  })

  afterAll(async () => {
    await server.stop()
  })

  afterEach(async () => {
    riskService.__resetReturnValue()
  })

  it('redirects to postcode page if user does not have an address set in session', async () => {
    // Get postcode page first to clear the previous address selection
    const mockRequest = {
      method: 'GET',
      url: '/postcode',
      headers: defaultOptions.headers
    }
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)

    mockRequest.url = '/rivers-and-sea'
    const swResponse = await server.inject(mockRequest)
    expect(swResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(swResponse.headers.location).toBe('/postcode')
  })

  it('returns 200 OK and renders rivers and sea page if user has an address set in session', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea',
      headers: defaultOptions.headers
    }
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.result).toContain('rivers-and-sea')
  })

  it('should show an error page if an error occurs', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea',
      headers: defaultOptions.headers
    }
    getByCoordinates.mockImplementationOnce(() => {
      throw new Error()
    })
    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  it('should return "Very low" risk probability when riverAndSeaRisk is not present', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/rivers-and-sea',
      headers: defaultOptions.headers
    }
    riskService.__updateReturnValue({
      riverAndSeaRisk: ''
    })

    const response = await server.inject(mockRequest)

    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    expect(response.result).toContain('govuk-tag--Very-Low')
  })
})
