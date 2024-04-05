const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const riskService = require('../../services/risk')
const { mockOptions, mockSearchOptions } = require('../../../test/mock')
let server, cookie

jest.mock('../../config')
jest.mock('../../services/flood')
jest.mock('../../services/address')
jest.mock('../../services/risk')

beforeAll(async () => {
  server = await createServer()
  await server.initialize()
  const initial = mockOptions()

  const homepageresponse = await server.inject(initial)
  expect(homepageresponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]
})

afterAll(async () => {
  await server.stop()
})

describe('england-only router', () => {
  test('requesting the england-only page without searching should redirect', async () => {
    const options = {
      method: 'GET',
      url: '/england-only',
      headers: {
        cookie
      }
    }
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(response.headers.location).toEqual('/postcode')
  })

  test('should get the /england-only page if not an address in England', async () => {
    riskService.__updateReturnValue({ inEngland: false })
    const { getOptions, postOptions } = mockSearchOptions('NP18 3EZ', cookie)
    //   const postOptions = {
    //   method: 'POST',
    //   url: `/postcode?postcode=${encodeURIComponent('NP18 3EZ')}`,
    //   headers: {
    //     'Content-type': 'application/x-www-form-urlencoded',
    //     cookie
    //   },
    //   payload: 'address=0'
    // }
    let postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch(`/search?postcode=${encodeURIComponent('NP18 3EZ')}`)

    let getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)

    postOptions.url = `/search?postcode=${encodeURIComponent('NP18 3EZ')}`
    postOptions.payload = 'address=0'

    postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch('/risk')

    getOptions.url = '/risk'
    getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(getResponse.headers.location).toMatch('/england-only')
  })

  test('requesting the england-only page after a search should display', async () => {
    const options = {
      method: 'GET',
      url: '/england-only',
      headers: {
        cookie
      }
    }
    riskService.__updateReturnValue({ inEngland: false })
    const response = await server.inject(options)
    expect(response.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('should not get the /england-only page if an address in England', async () => {
    riskService.__updateReturnValue({ inEngland: true })
    const { getOptions, postOptions } = mockSearchOptions('NP18 3EZ', cookie)
    //   const postOptions = {
    //   method: 'POST',
    //   url: `/postcode?postcode=${encodeURIComponent('NP18 3EZ')}`,
    //   headers: {
    //     'Content-type': 'application/x-www-form-urlencoded',
    //     cookie
    //   },
    //   payload: 'address=0'
    // }
    let postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch(`/search?postcode=${encodeURIComponent('NP18 3EZ')}`)

    let getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)

    postOptions.url = `/search?postcode=${encodeURIComponent('NP18 3EZ')}`
    postOptions.payload = 'address=0'

    postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch('/risk')

    getOptions.url = '/risk'
    getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })

  test('requesting the england-only page with an NI postcode should display', async () => {
    riskService.__updateReturnValue({ inEngland: false })
    const { getOptions, postOptions } = mockSearchOptions('BT8 4AA', cookie)
    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch('/england-only?postcode=BT8%204AA&region=northern-ireland')

    getOptions.url = '/england-only'
    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
  })
})
