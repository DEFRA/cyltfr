const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const sinon = require('sinon')
const { mock, mockOptions, mockSearchOptions, mockCaptchaResponse, mockCaptchaCheck, createWarningStub, createAddressStub } = require('../mock')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const utils = require('../../server/util')
const captchaCheck = require('../../server/services/captchacheck')
const { payloadMatchTest } = require('../utils')
const STATUS_CODES = require('http2').constants
const floodWarning = {
  address: 'Bognor Regis, PO22 9HY',
  floods: [],
  severity: 2,
  message: 'There are currently one flood warning and 2 flood alerts in force at this location.'
}

lab.experiment('search page route', () => {
  let server, cookie, addressStub, warningStub

  // Make a server before the tests
  lab.before(async () => {
    server = await createServer()
    await server.initialize()
    const initial = mockOptions()

    const homepageresponse = await server.inject(initial)
    Code.expect(homepageresponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]
  })

  lab.beforeEach(() => {
    addressStub = createAddressStub(addressService)
    warningStub = createWarningStub(floodService)
  })

  lab.afterEach(() => {
    warningStub.revert()
    addressStub.revert()
    sinon.restore()
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test('/address - No banner warnings', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const noFloodWarning = { }
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, noFloodWarning))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    await payloadMatchTest(getResponse.payload, /Warning<\/span>/g, 0)
    floodServiceStub.revert()
  })

  lab.test('/address - flood warnings for unknown address', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const noFloodWarning = { ...floodWarning }
    noFloodWarning.address = 'England'
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, noFloodWarning))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    const re = new RegExp(noFloodWarning.message, 'g')
    await payloadMatchTest(getResponse.payload, re, 0)
    floodServiceStub.revert()
  })

  lab.test('/search - No warning banner severity', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const noFloodWarning = { ...floodWarning }
    noFloodWarning.severity = 5
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, noFloodWarning))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    const re = new RegExp(noFloodWarning.message, 'g')
    await payloadMatchTest(getResponse.payload, re, 0)
    floodServiceStub.revert()
  })

  lab.test('/search - With banner warnings', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const data = require('../data/banner-1.json')
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    const re = new RegExp(data.message, 'g')
    await payloadMatchTest(getResponse.payload, re, 1)
    floodServiceStub.revert()
  })

  lab.test('/search - With banner alerts', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const data = require('../data/banner-2.json')
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    const re = new RegExp(data.message, 'g')
    await payloadMatchTest(getResponse.payload, re, 1)
    floodServiceStub.revert()
  })

  lab.test('/search - Error', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const floodServiceStub = mock.replace(floodService, 'findWarnings', mock.makePromise(() => { throw new Error('An error') }))
    const oldNotify = server.methods.notify
    let notifyCalled = false
    const newNotify = () => { notifyCalled = true }
    server.methods.notify = newNotify
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    Code.expect(notifyCalled).to.equal(true)
    server.methods.notify = oldNotify
    floodServiceStub.revert()
  })

  lab.test('/search', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
  })

  lab.test('/search - Invalid postcode - fails regexp', async () => {
    const { getOptions } = mockSearchOptions('invalid', cookie)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  lab.test('/search - Invalid query', async () => {
    const options = {
      method: 'GET',
      url: '/search?invalid=foo',
      headers: { cookie }
    }
    const captchastub = mock.replace(captchaCheck, 'captchaCheck', mock.makePromise(null, mockCaptchaCheck('foo')))
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
    captchastub.revert()
  })

  lab.test('/search - Invalid postcode - passes regexp', async () => {
    const { getOptions } = mockSearchOptions('XX11 1XX', cookie)
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
  })

  lab.test('/search - Address service error', async () => {
    const options = {
      method: 'GET',
      url: '/search?error=true',
      payload: { postcode: null }
    }
    const addressServiceMock = sinon.stub(addressService, 'find')
    addressServiceMock.returns(false)
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const responseUrl = await server.inject(options)
    Code.expect(responseUrl.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
    captchastub.revert()
  })

  lab.test('/search - Address service returns empty address array', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const customAddressStub = mock.replace(addressService, 'find', mock.makePromise(null, []))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    customAddressStub.revert()
  })

  lab.test('/search - NATIONAL address to continue as normal', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    captchastub.revert()
  })

  lab.test('/search - NI address to redirect to england-only', async () => {
    const { getOptions } = mockSearchOptions('BT11BT', cookie)

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_FOUND)
    Code.expect(getResponse.headers.location).to.include('/england-only')
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
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_FOUND)
    captchastub.revert()
  })

  lab.test('400 for missing expected query parameter', async () => {
    const options = {
      method: 'GET',
      url: '/search?test=test'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_BAD_REQUEST)
  })

  // This test fails if the Captcha is not enabled. This needs fixing.
  // lab.test('should redirect user to postcode page if captcha times out or not found', async () => {
  //   const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(false, null)))
  //   const responseUrl = await server.inject(mockSearchOptions('cw8 4bh').getOptions)
  //   Code.expect(responseUrl.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_FOUND)
  //   captchastub.revert()
  // })

  lab.test('should get search page with postcode if already queried and captcha not expired', async () => {
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const responseUrl = await server.inject(mockSearchOptions('cw8 4bh', cookie).getOptions)
    Code.expect(responseUrl.statusCode).to.equal(STATUS_CODES.HTTP_STATUS_OK)
    captchastub.revert()
  })
})
