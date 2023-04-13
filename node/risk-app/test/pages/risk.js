const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const createServer = require('../../server')
const lab = exports.lab = Lab.script()
const riskService = require('../../server/services/risk')
const { mock } = require('../mock')
// const { payloadMatchTest } = require('../utils')

lab.experiment('Risk page test', () => {
  let server, cookie

  lab.before(async () => {
    server = await createServer()
    await server.initialize()
  })

  lab.after(async () => {
    await server.stop()
  })

  lab.test('Print risk-summary page', async () => {
    const options = {
      method: 'GET',
      url: '/risk',
      headers: { cookie }
    }

    const riskStub = mock.replace(riskService, 'getByCoordinates', mock.makePromise(null, {
      inEngland: true,
      isGroundwaterArea: true,
      floodAlertArea: ['AnyArea'],
      floodWarningArea: [],
      inFloodAlertArea: true,
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
      riverAndSeaRisk: { probabilityForBand: 'Low', suitability: 'County to Town' },
      surfaceWaterRisk: 'High',
      surfaceWaterSuitability: 'County to Town',
      extraInfo: null
    }))

    const response = await server.inject(options)
    const { payload } = response
    console.log('Payload => ', payload)
    Code.expect(response.statusCode).to.equal(200)
    riskStub.revert()
  })
})
