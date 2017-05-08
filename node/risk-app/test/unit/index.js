var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var mock = require('../mock')
var composeServer = require('../../server')
var helpers = require('../../server/helpers')
var riskService = require('../../server/services/risk')
var floodService = require('../../server/services/flood')
var addressService = require('../../server/services/address')
var config = require('../../config')
var mountPath = config.mountPath
  ? ('/' + config.mountPath)
  : ''

lab.experiment('Unit', function () {
  var server

  // Make a server before the tests
  lab.before(done => {
    console.log('Creating server')
    composeServer(function (err, result) {
      if (err) {
        console.log(err)
        return done(err)
      }

      server = result
      server.initialize(done)
    })
  })

  lab.after((done) => {
    console.log('Stopping server')
    server.stop(done)
  })

  lab.test('/feedback', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/feedback'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/feedback - With referrer header', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/feedback',
      headers: { referer: 'http://en.wikipedia.org/wiki/Main_Page' }
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/banner', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback(null, []))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/banner - No warnings', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback(null, null))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/banner - No warning severity', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback(null, {
      message: 'There is currently one flood alert in force at this location.'
    }))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/banner - With warnings', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var data = require('../data/banner-1.json')
    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback(null, data))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/banner - With alerts', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var data = require('../data/banner-2.json')
    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback(null, data))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/banner - Error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/banner?postcode=cw8 4bh'
    }

    var stub = mock.replace(floodService, 'findWarnings', mock.makeCallback('Mock Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/', function (done) {
    var options = {
      method: 'GET',
      url: mountPath || '/'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/ - With known error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath || '/' + '?err=postcode'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/ - With unknown error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath || '/' + '?err=postXcode'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/map', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/map?easting=1&northing=1&address=1'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/os-terms', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/os-terms'
    }
    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      done()
    })
  })

  lab.test('/risk - Address service error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback('Mock Address Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      done()
    })
  })

  lab.test('/risk - Risk service error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback('Mock Risk Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk - Not inEngland', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk - inFloodWarningArea error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk - inFloodAlertArea error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk - riverAndSeaRisk error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk - surfaceWaterRisk error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  /**
   * Tests `/risk 1` to `/risk 10` exercise different
   * branches of code in the file `server/models/risk-view.js`
   */
  lab.test('/risk 1', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 2', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 3', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 4', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 5', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 6', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 7', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 8', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 9', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk 10', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/search', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/search?postcode=cw8 4bh'
    }

    var addressStub = mock.replace(addressService, 'findByPostcode', mock.makeCallback(null, [
      { uprn: '100041117437', address: '134, HIGH STREET, SPETISBURY, BLANDFORD FORUM, DT11 9DW' },
      { uprn: '100040586527', address: '135, HIGH STREET, SPETISBURY, BLANDFORD FORUM, DT11 9DW' },
      { uprn: '10013279111', address: '136, HIGH STREET, SPETISBURY, BLANDFORD FORUM, DT11 9DW' }
    ]))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      done()
    })
  })

  lab.test('/search - Invalid postcode', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/search?postcode=1234'
    }

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302)
      done()
    })
  })

  lab.test('/search - Address service error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/search?postcode=cw8 4bh'
    }

    var addressStub = mock.replace(addressService, 'findByPostcode', mock.makeCallback('Mock Address Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      done()
    })
  })

  lab.test('/search - Address service returns no addresses', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/search?postcode=cw8 4bh'
    }

    var addressStub = mock.replace(addressService, 'findByPostcode', mock.makeCallback(null, null))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302)
      addressStub.revert()
      done()
    })
  })

  lab.test('/search - Address service returns empty address array', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/search?postcode=cw8 4bh'
    }

    var addressStub = mock.replace(addressService, 'findByPostcode', mock.makeCallback(null, []))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302)
      addressStub.revert()
      done()
    })
  })

  lab.test('/risk-detail - Address service error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback('Mock Address Error'))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail - Risk service error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback('Mock Risk Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail inFloodWarningArea error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail inFloodAlertArea error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail riverAndSeaRisk error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail surfaceWaterRisk error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail reservoirRisk error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail surfaceWaterSuitability error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail surfaceWaterSuitability error', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail inEngland false', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(302)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('/risk-detail', function (done) {
    var options = {
      method: 'GET',
      url: mountPath + '/risk-detail?address=100010192035'
    }

    var addressStub = mock.replace(addressService, 'findById', mock.makeCallback(null, {
      uprn: '100010192035',
      postcode: 'CW8 4BH',
      x: 364853,
      y: 373782,
      address: '81, MOSS ROAD, NORTHWICH, CW8 4BH'
    }))

    var riskStub = mock.replace(riskService, 'getByCoordinates', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      addressStub.revert()
      riskStub.revert()
      done()
    })
  })

  lab.test('helpers', function (done) {
    var formatted1 = helpers.formatDate('2017-04-01T00:00:00Z')
    Code.expect(formatted1).to.equal('1:00am Saturday 01 April 2017')
    var formatted2 = helpers.formatDate('2017-04-01T00:00:00Z', 'DD MMMM YYYY')
    Code.expect(formatted2).to.equal('01 April 2017')
    done()
  })
})
