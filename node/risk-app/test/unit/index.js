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

  lab.test('/risk - Risk service error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates',
      mock.makePromise('Mock Risk Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk - Not inEngland', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates',
      mock.makePromise(null, {
        inEngland: false,
        isGroundwaterArea: false,
        floodAlertArea: [],
        floodWarningArea: [],
        inFloodAlertArea: false,
        inFloodWarningArea: false,
        leadLocalFloodAuthority: 'Cheshire West and Chester',
        reservoirRisk: null,
        riverAndSeaRisk: null,
        surfaceWaterRisk: 'Very Low',
        surfaceWaterSuitability: 'County to Town',
        extraInfo: null
      }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    riskStub.revert()
  })

  lab.test('/risk - inFloodWarningArea error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: 'Error',
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk - inFloodAlertArea error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: 'Error',
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk - riverAndSeaRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: 'Error',
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk - surfaceWaterRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Error',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  /**
   * Tests `/risk 1` to `/risk 10` exercise different
   * branches of code in the file `server/models/risk-view.js`
   */
  lab.test('/risk 1', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 2', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: true,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 3', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: true,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low' },
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 4', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: true,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: null,
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 5', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: true,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: [{
        reservoirName: 'Draycote Water',
        location: '445110, 270060',
        riskDesignation: 'High Risk',
        undertaker: 'Severn Trent Water Authority',
        leadLocalFloodAuthority: 'Warwickshire',
        environmentAgencyArea: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
        comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
      }],
      riverAndSeaRisk: null,
      surfaceWaterRisk: null,
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 6', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'High' },
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 7', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Medium' },
      surfaceWaterRisk: 'Very Low',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 8', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'High',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 9', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: null,
      surfaceWaterRisk: 'Medium',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })

  lab.test('/risk 10', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
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

  lab.test('/risk WELSH address to redirect to england-only', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: false
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    riskStub.revert()
  })

  lab.test('/risk SCOTTISH address to redirect to england-only', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: false
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    riskStub.revert()
  })

  lab.test('/risk - Risk service error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise('Mock Risk Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk inFloodWarningArea error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: 'Error',
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk inFloodAlertArea error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: 'Error',
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk riverAndSeaRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: 'Error',
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk surfaceWaterRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'Error',
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk reservoirDryRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirDryRisk: 'Error',
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk reservoirWetRisk error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirWetRisk: 'Error',
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk surfaceWaterSuitability error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: 'Error',
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk surfaceWaterSuitability error', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Error',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    riskStub.revert()
  })

  lab.test('/risk inEngland false', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: false,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: null,
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    riskStub.revert()
  })

  lab.test('/risk', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: {
        cookie
      }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
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
})
