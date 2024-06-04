const STATUS_CODES = require('http2').constants
const createServer = require('../../../server')
const addressService = require('../../services/__mocks__/address')
const { mockOptions, mockSearchOptions } = require('../../../test/mock')
const defaultOptions = {
  method: 'GET',
  url: '/risk'
}

jest.mock('../../services/flood')
jest.mock('../../services/address')
jest.mock('../../services/risk')
jest.mock('../../config')

describe('server methods', () => {
  let server, cookie

  beforeAll(async () => {
    server = await createServer()
    await server.initialize()
    const initial = mockOptions()

    const homepageresponse = await server.inject(initial)
    expect(homepageresponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]
  })

  beforeEach(async () => {
    const { getOptions, postOptions } = mockSearchOptions('NP18 3EZ', cookie)
    let postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch(`/search?postcode=${encodeURIComponent('NP18 3EZ')}`)

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_OK)
    postOptions.url = `/search?postcode=${encodeURIComponent('NP18 3EZ')}`
    postOptions.payload = 'address=0'

    postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toEqual(STATUS_CODES.HTTP_STATUS_FOUND)
    expect(postResponse.headers.location).toMatch('/risk')
    defaultOptions.headers = { cookie }
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('cache disabled', () => {
    it('should return updated cached address', async () => {
      const response = await server.methods.find('CV37 6YZ')

      expect(response).toEqual([
        expect.objectContaining({
          uprn: '100070216073',
          postcode: 'CV37 6YZ',
          address: '11, BANCROFT PLACE, STRATFORD-UPON-AVON, CV37 6YZ',
          country: 'ENGLAND'
        })
      ])

      addressService.updateAddress('CV37 6YZ', [
        {
          uprn: '100070216073',
          postcode: 'CV37 6YZ',
          address: '12, BANCROFT PLACE, STRATFORD-UPON-AVON, CV37 6YZ',
          country: 'ENGLAND'
        }
      ])

      const changedResponse = await server.methods.find('CV37 6YZ')

      expect(changedResponse).toEqual([
        expect.objectContaining({
          uprn: '100070216073',
          postcode: 'CV37 6YZ',
          address: '12, BANCROFT PLACE, STRATFORD-UPON-AVON, CV37 6YZ',
          country: 'ENGLAND'
        })
      ])
    })
  })
})
