const Lab = require('lab')
const Code = require('code')
const glupe = require('glupe')
const lab = exports.lab = Lab.script()
const mock = require('../mock')
const { manifest, options } = require('../../server')
const apiService = require('../../server/services')

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

  lab.test('/floodrisk/{x}/{y}/{radius}', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [
        {
          calculate_flood_risk: {
            in_england: true,
            flood_alert_area: null,
            flood_warning_area: null,
            rofrs_risk: null,
            surface_water_risk: 'Very Low',
            reservoir_risk: null,
            surface_water_suitability: 'County to Town',
            lead_local_flood_authority: 'Cheshire West and Chester',
            extra_info: null
          }
        }
      ]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Throws db error', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk',
      mock.makePromise(new Error('Mock Error')))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - No db result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise())

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {}))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [{}]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(400)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [
        {
          calculate_flood_risk: {
            in_england: true,
            flood_alert_area: [
              '033WAF204'
            ],
            flood_warning_area: [
              '033FWF3AVON013'
            ],
            rofrs_risk: {
              prob_4band: 'Medium',
              suitability: 'Street to Parcels of land',
              risk_for_insurance_sop: 'Yes'
            },
            surface_water_risk: 'High',
            reservoir_risk: [
              {
                resname: 'Draycote Water',
                risk_desig: 'High Risk',
                location: '445110, 270060',
                ut_company: 'Severn Trent Water Authority',
                ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
                llfa_name: 'Warwickshire',
                comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
              }
            ],
            surface_water_suitability: 'County to Town',
            lead_local_flood_authority: 'Warwickshire',
            extra_info: null
          }
        }
      ]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater alert result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [
        {
          calculate_flood_risk: {
            in_england: true,
            flood_alert_area: [
              '033WAG204'
            ],
            flood_warning_area: [
              '033FWF3AVON013'
            ],
            rofrs_risk: {
              prob_4band: 'Medium',
              suitability: 'Street to Parcels of land',
              risk_for_insurance_sop: 'Yes'
            },
            surface_water_risk: 'High',
            reservoir_risk: [
              {
                resname: 'Draycote Water',
                risk_desig: 'High Risk',
                location: '445110, 270060',
                ut_company: 'Severn Trent Water Authority',
                ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
                llfa_name: 'Warwickshire',
                comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
              }
            ],
            surface_water_suitability: 'County to Town',
            lead_local_flood_authority: 'Warwickshire',
            extra_info: null
          }
        }
      ]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater warning result', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [
        {
          calculate_flood_risk: {
            in_england: true,
            flood_alert_area: [
              '033WAF204'
            ],
            flood_warning_area: [
              '033FWG3AVON013'
            ],
            rofrs_risk: {
              prob_4band: 'Medium',
              suitability: 'Street to Parcels of land',
              risk_for_insurance_sop: 'Yes'
            },
            surface_water_risk: 'High',
            reservoir_risk: [
              {
                resname: 'Draycote Water',
                risk_desig: 'High Risk',
                location: '445110, 270060',
                ut_company: 'Severn Trent Water Authority',
                ea_area: 'Environment Agency - Staffordshire, Warwickshire and West Midlands',
                llfa_name: 'Warwickshire',
                comments: 'If you have questions about local emergency plans for this reservoir you should contact the named Local Authority'
              }
            ],
            surface_water_suitability: 'County to Town',
            lead_local_flood_authority: 'Warwickshire',
            extra_info: null
          }
        }
      ]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater area error', async () => {
    const options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    const stub = mock.replace(apiService, 'calculateFloodRisk', mock.makePromise(null, {
      rows: [
        {
          calculate_flood_risk: {
            in_england: true,
            flood_alert_area: 'Error',
            flood_warning_area: 'Error'
          }
        }
      ]
    }))

    const response = await server.inject(options)
    Code.expect(response.statusCode).to.equal(200)
    stub.revert()
  })
})
