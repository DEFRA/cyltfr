var Lab = require('lab')
var Code = require('code')
var lab = exports.lab = Lab.script()
var mock = require('../mock')
var composeServer = require('./server')
var apiService = require('../../server/services')

lab.experiment('Unit', function () {
  var server

  // Make a server before the tests
  lab.before(done => {
    console.log('Creating server')
    composeServer(function (err, result) {
      if (err) {
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

  lab.test('/floodrisk/{x}/{y}/{radius}', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Throws db error', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback('Mock Error'))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - No db result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback())

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {}))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
      rows: [{}]
    }))

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(400)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Invalid db result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater alert result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater warning result', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })

  lab.test('/floodrisk/{x}/{y}/{radius} - Groundwater area error', function (done) {
    var options = {
      method: 'GET',
      url: '/floodrisk/391416/102196/20'
    }

    var stub = mock.replace(apiService, 'calculateFloodRisk', mock.makeCallback(null, {
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

    server.inject(options, function (response) {
      Code.expect(response.statusCode).to.equal(200)
      stub.revert()
      done()
    })
  })
})
