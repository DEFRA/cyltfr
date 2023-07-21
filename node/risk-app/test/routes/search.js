const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { mock, mockOptions, mockSearchOptions, mockCaptchaResponse, mockCaptchaCheck } = require('../mock')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const utils = require('../../server/util')
const captchaCheck = require('../../server/services/captchacheck')
const { payloadMatchTest } = require('../utils')
const createAddressStub = () => {
  return mock.replace(addressService, 'find', mock.makePromise(null, [
    {
      uprn: '100041117437',
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
      country: 'ENGLAND',
      postcode: 'CW8 4BH'
    }
  ]))
}
const createWarningStub = () => mock.replace(floodService, 'findWarnings', mock.makePromise(null, null))

lab.experiment('Unit', () => {
  let server, cookie

  // Make a server before the tests
  lab.before(async () => {
    server = await createServer()
    await server.initialize()

    const initial = mockOptions()

    const homepageresponse = await server.inject(initial)
    Code.expect(homepageresponse.statusCode).to.equal(200)
    cookie = homepageresponse.headers['set-cookie'][0].split(';')[0]
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test('/search - banner ', async () => {
    // This doesn't seem to actually test anything TODO: Check this test
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const addressStub = createAddressStub()
    const warningStub = createWarningStub()
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/address - No banner warnings', async () => {
    // This doesn't seem to actually test anything TODO: Check this test
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const addressStub = createAddressStub()
    const warningStub = createWarningStub()
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/search - No warning banner severity', async () => {
    // This doesn't seem to actually test anything TODO: Check this test
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, {
      message: 'There is currently one flood alert in force at this location.'
    }))
    const addressStub = createAddressStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    stub.revert()
    addressStub.revert()
  })

  lab.test('/search - With banner warnings', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const data = require('../data/banner-1.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const addressStub = createAddressStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    await payloadMatchTest(getResponse.payload, /There is currently one flood alert in force at this location/g)
    stub.revert()
    addressStub.revert()
  })

  lab.test('/search - With banner alerts', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const data = require('../data/banner-2.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const addressStub = createAddressStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    await payloadMatchTest(getResponse.payload, /There is currently one flood alert in force at this location/g)
    stub.revert()
    addressStub.revert()
  })

  lab.test('/search - Error', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(() => { throw new Error('An error') }))
    const addressStub = createAddressStub()
    const oldNotify = server.methods.notify
    let notifyCalled = false
    const newNotify = () => { notifyCalled = true }
    server.methods.notify = newNotify

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    Code.expect(notifyCalled).to.equal(true)
    server.methods.notify = oldNotify
    stub.revert()
    addressStub.revert()
  })

  lab.test('/search', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const addressStub = createAddressStub()
    const warningStub = createWarningStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/search - Invalid postcode - fails regexp', async () => {
    const { getOptions } = mockSearchOptions('invalid', cookie)

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(400)
  })

  lab.test('/search - Invalid query', async () => {
    const options = {
      method: 'GET',
      url: '/search?invalid=foo',
      headers: { cookie }
    }
    const captchastub = mock.replace(captchaCheck, 'captchaCheck', mock.makePromise(null, mockCaptchaCheck('foo')))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    captchastub.revert()
  })

  lab.test('/search - Invalid postcode - passes regexp', async () => {
    const { getOptions } = mockSearchOptions('XX11 1XX', cookie)
    const addressStub = createAddressStub()
    const warningStub = createWarningStub()
    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/search - Address service error', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)
    const addressStub = mock.replace(addressService, 'find', mock.makePromise('Mock Address Error'))
    const warningStub = createWarningStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(400)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/search - Address service returns empty address array', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, []))
    const warningStub = createWarningStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    warningStub.revert()
    addressStub.revert()
  })

  lab.test('/search - NATIONAL address to continue as normal', async () => {
    const { getOptions } = mockSearchOptions('cw8 4bh', cookie)

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = createAddressStub()
    const warningStub = createWarningStub()

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
    warningStub.revert()
  })

  lab.test('/search - NI address to redirect to england-only', async () => {
    const { getOptions } = mockSearchOptions('BT11BT', cookie)

    const getResponse = await server.inject(getOptions)
    Code.expect(getResponse.statusCode).to.equal(302)
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
    const addressStub = createAddressStub()
    const warningStub = createWarningStub()

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    captchastub.revert()
    addressStub.revert()
    warningStub.revert()
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
