const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const riskService = require('../../server/services/risk')
const floodService = require('../../server/services/flood')
const addressService = require('../../server/services/address')
const { mock, mockOptions } = require('../mock')
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

lab.experiment('Risk page test', () => {
  let server, cookie

  lab.before(async () => {
    server = await createServer()
    await server.initialize()

    const initial = mockOptions()

    const addressStub = createAddressStub()
    const warningStub = createWarningStub()

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

    const options2 = {
      method: 'POST',
      url: `/search?postcode=${encodeURIComponent('cw8 4bh')}`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        cookie
      },
      payload: 'address=0'
    }

    const response2 = await server.inject(options2)
    addressStub.revert()
    warningStub.revert()
    Code.expect(response2.statusCode).to.equal(302)
  })

  lab.after(async () => {
    console.log('Stopping server...')
    await server.stop()
  })

  lab.test('print risk-summary page for reservoir risk and surface water', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: { cookie }
    }
    // const address = {
    //   uprn: '100041117437',
    //   address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
    //   country: 'ENGLAND',
    //   postcode: 'CW8 4BH'
    // }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['AnyArea'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: true,
      reservoirDryRisk: [
        {
          reservoirName: 'Agden',
          location: 'SK2610092300',
          riskDesignation: 'High-risk',
          undertaker: 'Yorkshire Water Services Ltd',
          leadLocalFloodAuthority: 'Sheffield',
          comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
        }
      ],
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirWetRisk: [{
        reservoirName: 'Draycote Water',
        location: '445110, 270060',
        riskDesignation: 'High Risk',
        undertaker: 'Severn Trent Water Authority',
        leadLocalFloodAuthority: 'Warwickshire',
        environmentAgencyArea: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
        comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
      }],
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'High',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<caption class="govuk-table__caption">81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND<\/caption>/g)
    await payloadMatchTest(payload, /<td class="govuk-table__cell">\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\sThere is a risk of flooding from reservoirs in this area, reservoirs that can affect this area are:\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<ul class="govuk-list govuk-list--bullet">\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<li>Agden<\/li>\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<li>Draycote Water<\/li>\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<\/ul>\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<\/td>/g)
    await payloadMatchTest(payload, /<td class="govuk-table__cell">\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\sFlooding is possible in the local area when groundwater levels are high\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<\/td>/g)

    riskStub.revert()
  })

  lab.test('print risk-summary page for low reservoir risk and low surface water', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: { cookie }
    }
    // const address = {
    //   uprn: '100041117437',
    //   address: '81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND',
    //   country: 'ENGLAND',
    //   postcode: 'CW8 4BH'
    // }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: false,
      floodAlertArea: ['AnyArea'],
      floodWarningArea: [],
      inFloodAlertArea: true,
      inFloodWarningArea: true,
      reservoirDryRisk: null,
      leadLocalFloodAuthority: 'Cheshire West and Chester',
      reservoirWetRisk: null,
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'High',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    Code.expect(response.statusCode).to.equal(200)
    await payloadMatchTest(payload, /<caption class="govuk-table__caption">81, MOSS ROAD, NORTHWICH, CW8 4BH, ENGLAND<\/caption>/g)
    await payloadMatchTest(payload, /<td class="govuk-table__cell">\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\sFlooding from reservoirs is unlikely in this area\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<\/td>/g)
    await payloadMatchTest(payload, /<td class="govuk-table__cell">\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s\sFlooding from groundwater is unlikely in this area\s\s\s\s\s\s\s\s\s\s\s\s\s\s\s<\/td>/g)

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
