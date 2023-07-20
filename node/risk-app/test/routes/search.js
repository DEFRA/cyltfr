const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { mock, mockOptions, mockSearchOptions, mockCaptchaResponse } = require('../mock')
const config = require('../../server/config')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const utils = require('../../server/util')
const { payloadMatchTest } = require('../utils')

lab.experiment('Unit', () => {
  let server, cookie

  // Make a server before the tests
  lab.before(async () => {
    server = await createServer()
    await server.initialize()

    const initial = mockOptions()
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      {
        uprn: '100041117437',
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
        country: 'ENGLAND',
        postcode: 'CW8 4BH'
      }
    ]))

    const homepageresponse = await server.inject(initial)
    Code.expect(homepageresponse.statusCode).to.equal(200)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]

    const response = await server.inject({
      method: 'POST',
      url: '/postcode',
      headers: {
        cookie,
        'Content-type': 'application/x-www-form-urlencoded'
      },
      payload: 'postcode=cw8+4bh'
    })
    Code.expect(response.statusCode).to.equal(302)

    const addressresponse = await server.inject({
      method: 'GET',
      url: `/search?postcode=${encodeURIComponent('cw8 4bh')}`,
      headers: {
        cookie
      }
    })
    Code.expect(addressresponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()

    const options2 = {
      method: 'POST',
      url: '/search?postcode=cw8%204bh',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        cookie
      },
      payload: 'address=0'
    }

    const response2 = await server.inject(options2)
    Code.expect(response2.statusCode).to.equal(302)
    console.log('server => ', server.yar)
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test('/search - banner ', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    // const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, []))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))
    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/address - No banner warnings', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, null))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
    addressStub.revert()
  })

  lab.test('/search - No warning banner severity', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, {
      message: 'There is currently one flood alert in force at this location.'
    }))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - With banner warnings', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const data = require('../data/banner-1.json')
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - With banner alerts', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const data = require('../data/banner-2.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - Error', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise('Mock Error'))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      {
        uprn: '100041117437',
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
        country: 'ENGLAND',
        postcode: 'CW8 4BH'
      }
    ]))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - Invalid postcode', async () => {
    const { postOptions } = mockSearchOptions('invalid', cookie)

    const postResponse = await server.inject(postOptions)
    const { payload } = postResponse
    Code.expect(postResponse.statusCode).to.equal(200)
    await payloadMatchTest(payload, 'Enter a full postcode in England')
  })

  lab.test('/search - Invalid query', async () => {
    let options
    const postcode = 'foo'
    if (config.friendlyCaptchaEnabled) {
      options = {
        method: 'GET',
        url: `/search?invalid=${encodeURIComponent(postcode)}&token=${encodeURIComponent('sample token')}`
      }
    } else {
      options = {
        method: 'GET',
        url: '/search?invalid=foo'
      }
    }
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    captchastub.revert()
  })

  lab.test('/search - Address service error', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const addressStub = mock.replace(addressService, 'find', mock.makePromise('Mock Address Error'))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(400)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - Address service returns empty address array', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, []))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - NATIONAL address to continue as normal', async () => {
    const { postOptions, getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - NI address to redirect to england-only', async () => {
    const { postOptions } = mockSearchOptions('BT11BT', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const postResponse = await server.inject(postOptions)
    Code.expect(postResponse.statusCode).to.equal(302)
    Code.expect(postResponse.headers.location).to.include('/england-only')
    captchastub.revert()
  })

  lab.test('Accept & strip unknown query parameters', async () => {
    const options = {
      method: 'POST',
      url: '/postcode',
      headers: {
        cookie
      },
      payload: { postcode: 'CW8 4BH', a: 'b' }
    }
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('400 for missing expected query parameter', async () => {
    const options = {
      method: 'GET',
      url: '/search?test=test'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
  })
})
