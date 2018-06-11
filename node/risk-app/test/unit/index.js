const Lab = require('lab')
const Code = require('code')
const glupe = require('glupe')
const lab = exports.lab = Lab.script()
const mock = require('../mock')
const { manifest, options } = require('../../server')
const helpers = require('../../server/helpers')
const riskService = require('../../server/services/risk')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const config = require('../../config')
const mountPath = config.mountPath
  ? ('/' + config.mountPath)
  : ''

lab.experiment('Unit', () => {
  let server

  // Make a server before the tests
  lab.before(async () => {
    console.log('Creating server')
    server = await glupe.compose(manifest, options)
  })

  lab.after(async () => {
    console.log('Stopping server')
    await server.stop()
  })

  lab.test('/feedback', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/feedback'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/feedback - With referrer header', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/feedback',
      headers: { referer: 'http://en.wikipedia.org/wiki/Main_Page' }
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/banner', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, []))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/banner - No warnings', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, null))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/banner - No warning severity', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, {
      message: 'There is currently one flood alert in force at this location.'
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/banner - With warnings', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const data = require('../data/banner-1.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/banner - With alerts', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const data = require('../data/banner-2.json')
    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise(null, data))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/banner - Error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    const stub = mock.replace(floodService, 'findWarnings', mock.makePromise('Mock Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/', async () => {
    const options = {
      method: 'GET',
      url: mountPath || '/'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/ - With known error', async () => {
    const options = {
      method: 'GET',
      url: mountPath || '/' + '?err=postcode'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/ - With unknown error', async () => {
    const options = {
      method: 'GET',
      url: mountPath || '/' + '?err=postXcode'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/map', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/map?easting=1&northing=1&address=1'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/os-terms', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/os-terms'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
  })

  lab.test('/risk - Address service error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById',
      mock.makePromise('Mock Address Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
  })

  lab.test('/risk - Risk service error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById',
      mock.makePromise(null, {
        uprn: '100010192035',
        postcode: 'CW8 4BH',
        x: 364853,
        y: 373782,
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
      }))

    const riskStub = mock.replace(riskService, 'getByCoordinates',
      mock.makePromise('Mock Risk Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk - Not inEngland', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById',
      mock.makePromise(null, {
        uprn: '100010192035',
        postcode: 'CW8 4BH',
        x: 364853,
        y: 373782,
        address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
      }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk - inFloodWarningArea error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk - inFloodAlertArea error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk - riverAndSeaRisk error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk - surfaceWaterRisk error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  /**
   * Tests `/risk 1` to `/risk 10` exercise different
   * branches of code in the file `server/models/risk-view.js`
   */
  lab.test('/risk 1', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 2', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 3', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 4', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 5', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
        isUtilityCompany: 'Severn Trent Water Authority',
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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 6', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 7', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 8', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 9', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk 10', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/search', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=81&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND', country: 'ENGLAND' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    addressStub.revert()
  })

  lab.test('/search - Invalid postcode', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=81&postcode=AB1 1AB'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
  })

  lab.test('/search - Address service error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'findByPostcode', mock.makePromise('Mock Address Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
  })

  lab.test('/search - Address service returns no addresses', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=1&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, null))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    addressStub.revert()
  })

  lab.test('/search - Address service returns empty address array', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=1&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, []))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    addressStub.revert()
  })

  lab.test('/search - NATIONAL address to continue as normal', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=81&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, NATIONAL', country: 'NATIONAL' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    addressStub.revert()
  })

  lab.test('/search - SCOTTISH address to redirect to england-only', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=81&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, SCOTLAND', country: 'SCOTLAND' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    addressStub.revert()
  })

  lab.test('/search - WELSH address to redirect to england-only', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?premises=81&postcode=cw8 4bh'
    }

    const addressStub = mock.replace(addressService, 'find', mock.makePromise(null, [
      { uprn: '100041117437', address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, WALES', country: 'WALES' }
    ]))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(302)
    Code.expect(response.headers.location).to.include('/england-only')
    addressStub.revert()
  })

  lab.test('/risk-detail - Address service error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise('Mock Address Error'))

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
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail - Risk service error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise('Mock Risk Error'))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail inFloodWarningArea error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail inFloodAlertArea error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail riverAndSeaRisk error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail surfaceWaterRisk error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail reservoirRisk error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: [],
      floodWarningArea: [],
      inFloodAlertArea: false,
      inFloodWarningArea: false,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirRisk: 'Error',
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: null,
      surfaceWaterSuitability: null,
      extraInfo: null
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail surfaceWaterSuitability error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail surfaceWaterSuitability error', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail inEngland false', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('/risk-detail', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    const addressStub = mock.replace(addressService, 'findById', mock.makePromise(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

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
    addressStub.revert()
    riskStub.revert()
  })

  lab.test('helpers', () => {
    const formatted1 = helpers.formatDate('2017-04-01T00:00:00Z')
    Code.expect(formatted1).to.equal('1:00am Saturday 01 April 2017')
    const formatted2 = helpers.formatDate('2017-04-01T00:00:00Z', 'DD MMMM YYYY')
    Code.expect(formatted2).to.equal('01 April 2017')
  })

  lab.test('404 for unknown query parameter', async () => {
    const options = {
      method: 'GET',
      url: mountPath + '/search?test=test'
    }

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
  })
})
