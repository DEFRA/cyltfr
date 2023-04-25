const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const { mock, mockOptions, mockCaptchaResponse } = require('../mock')
const config = require('../../server/config')
const riskService = require('../../server/services/risk')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const utils = require('../../server/util')
const { payloadMatchTest } = require('../utils')

lab.experiment('Unit', () => {
  let server, cookie

  // Make a server before the tests
  lab.before(async () => {
    console.log('Creating server')
    server = await createServer()
    await server.initialize()

    const options = mockOptions('cw8 4bh')
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      {
        uprn: '100041117437',
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
        country: 'ENGLAND',
        postcode: 'CW8 4BH'
      }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()

    cookie = response.headers['set-cookie'][0].split(';')[0]

    const options2 = {
      method: 'POST',
      url: '/search?postcode=cw8 4bh',
      headers: {
        cookie
      },
      payload: {
        address: '0'
      }
    }

    const response2 = await server.inject(options2)
    Code.expect(response2.statusCode).to.equal(302)
    cookie = response.headers['set-cookie'][0].split(';')[0]
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test('/feedback', async () => {
    const options = {
      method: 'GET',
      url: '/feedback'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/feedback - With referrer header', async () => {
    const options = {
      method: 'GET',
      url: '/feedback',
      headers: { referer: 'http://en.wikipedia.org/wiki/Main_Page' }
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/search - banner ', async () => {
    const options = mockOptions('cw8 4bh')

    // const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, []))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
  })

  lab.test('/address - No banner warnings', async () => {
    const options = mockOptions('cw8 4bh')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, null))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - No warning banner severity', async () => {
    const options = mockOptions('cw8 4bh')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, {
      message: 'There is currently one flood alert in force at this location.'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - With banner warnings', async () => {
    const options = mockOptions('cw8 4bh')

    const data = require('../data/banner-1.json')
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - With banner alerts', async () => {
    const options = mockOptions('cw8 4bh')

    const data = require('../data/banner-2.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/search - Error', async () => {
    const options = mockOptions('cw8 4bh')

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise('Mock Error'))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    stub.revert()
  })

  lab.test('/', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(301)
  })

  lab.test('/map', async () => {
    const options = {
      method: 'GET',
      url: '/map?easting=1&northing=1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/os-terms', async () => {
    const options = {
      method: 'GET',
      url: '/os-terms'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })
  lab.test('/search', async () => {
    const options = mockOptions('cw8 4bh')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      {
        uprn: '100041117437',
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
        country: 'ENGLAND',
        postcode: 'CW8 4BH'
      }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - Invalid postcode', async () => {
    const options = mockOptions('invalid')

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
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
    const options = mockOptions('cw8 4bh')

    const addressStub = mock.replace(addressService, 'find', mock.makePromise('Mock Address Error'))
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - Address service returns empty address array', async () => {
    const options = mockOptions('cw8 4bh')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, []))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - NATIONAL address to continue as normal', async () => {
    const options = mockOptions('cw8 4bh')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))
    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
    addressStub.revert()
  })

  lab.test('/search - NI address to redirect to england-only', async () => {
    const options = mockOptions('BT11BT')

    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    captchastub.revert()
  })
  lab.test('400 for missing expected query parameter', async () => {
    const options = {
      method: 'GET',
      url: '/search?test=test'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
  })

  lab.test('Accept & strip unknown query parameters', async () => {
    let options
    if (config.friendlyCaptchaEnabled) {
      options = {
        method: 'GET',
        url: `/search?postcode=CW8%204BH&a=b&token=${encodeURIComponent('sampletoken')}`
      }
    } else {
      options = {
        method: 'GET',
        url: '/search?postcode=CW8%204BH&a=b'
      }
    }
    const captchastub = mock.replace(utils, 'post', mock.makePromise(null, mockCaptchaResponse(true, null)))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    captchastub.revert()
  })

  lab.test('Ignore unknown cookies', async () => {
    const options = {
      method: 'GET',
      url: '/managing-flood-risk',
      headers: {
        cookie: 'some-token=<token>'
      }
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('Redirect view  when session is active', async () => {
    // const friendlyRecaptcha = 'some captcha'
    const options = {
      method: 'POST',
      url: '/postcode',
      headers: {
        cookie: 'activity=eyJzZXNzaW9uIjoiYWN0aXZlIn0='
      },
      payload: {
        postcode: 'cw8 4bh',
        'frc-captcha-solution': 'some captcha'
      }
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
  })

  lab.test('Throw an error  when session times out', async () => {
    // const friendlyRecaptcha = 'some captcha'
    const options = {
      method: 'POST',
      url: '/postcode',
      headers: {
        cookie: ''
      },
      payload: {
        postcode: 'cw8 4bh',
        'frc-captcha-solution': 'some captcha'
      }
    }

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(400)
    await payloadMatchTest(payload, /<h1 class="govuk-heading-xl">Session timed out<\/h1>/g)
  })

  lab.test('Check accessibility page', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility-statement',
      headers: {

      }
    }
    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<p class="govuk-body">\n\s\s\s\s\s\s\s\sThe website has the following content which is out of scope of the accessibility regulations:\n\s\s\s\s\s\s<\/p>\n\s\s\s\s\s\s<ul class="govuk-list govuk-list--bullet">\n\s\s\s\s\s\s\s\s<li>maps<\/li>\n\s\s\s\s\s\s\s\s<li>third party content which is out of our control, for example a corporate logo on the map the website uses\n\s\s\s\s\s\s\s\s<\/li>\n\s\s\s\s\s\s\s\s<li>PDF content that was published before 23 September 2018<\/li>\n\s\s\s\s\s\s<\/ul>/g)
  })

  lab.test('Checking for Managing Risk link in risk result page', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }
    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['AnyArea'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Croydon',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Very Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'National to County',
      extraInfo: null
    }))
    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<h3 class="govuk-heading-m">Manage your flood risk<\/h3>/g, 1)
    riskStub.revert()
  })

  lab.test('Implementing Rivers and Sea managing flood risk changes for very low risk areas', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['064FAG99SElondon'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Croydon',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Very Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'National to County',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<span class="govuk-details__summary-text">What you can do<\/span>/g, 0)
    riskStub.revert()
  })

  lab.test('Implementing Rivers and Sea managing flood risk changes for both surface water and rivers&sea in low risk areas', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['064FAG99SElondon'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Suffolk',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'Low',
      surfaceWaterSuitability: 'National to County',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<span class="govuk-details__summary-text">What you can do<\/span>/g, 2)
    riskStub.revert()
  })

  lab.test('Implementing Rivers and Sea managing flood risk changes for only surface water in low risk areas', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['064FAG99SElondon'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Hertfordshire',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Very Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'Low',
      surfaceWaterSuitability: 'National to County',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<span class="govuk-details__summary-text">What you can do<\/span>/g, 1)
    riskStub.revert()
  })
})
