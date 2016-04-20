var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/floodrisk/{x}/{y}/{radius}',
  config: {
    description: 'Get the long term flood risk associated with a point. Surface water risk is calculated based on a radius (metres) buffered point in polygon search.',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.calculateFloodRisk(db, params.x, params.y, params.radius, function (err, result) {
        /*
         * Do some assertions around the result we get back from the database
         */
        if (err) {
          return reply(Boom.badRequest('Database call failed', err))
        }

        if (!result || !Array.isArray(result.rows) || result.rows.length !== 1) {
          return reply(Boom.badRequest('Invalid result'), new Error('Expected an Array'))
        }

        var risk = result.rows[0].calculate_flood_risk

        if (!risk) {
          request.log('error')
          return reply(Boom.badRequest('Invalid result'), new Error('Missing calculate_flood_risk key'))
        }

        /*
         * If we get here we can be sure we have a valid result from
         * the database and we can start to prepare our return response
         */
        var reservoirRisk = null
        var riverAndSeaRisk = null

        if (risk.reservoir_risk) {
          reservoirRisk = risk.reservoir_risk.map(function (item) {
            return {
              reservoirName: item.resname,
              location: item.location,
              riskDesignation: item.risk_desig,
              isUtilityCompany: item.ut_company,
              leadLocalFloodAuthority: item.llfa_name,
              environmentAgencyArea: item.ea_area,
              comments: item.comments
            }
          })
        }

        if (risk.rofrs_risk) {
          riverAndSeaRisk = {
            probabilityForBand: risk.rofrs_risk.prob_4band,
            suitability: risk.rofrs_risk.suitability,
            riskForInsuranceSOP: risk.rofrs_risk.risk_for_insurance_sop
          }
        }

        var response = {
          inEngland: risk.in_england,
          inFloodAlertArea: risk.in_flood_alert_area,
          inFloodWarningArea: risk.in_flood_warning_area,
          leadLocalFloodAuthority: risk.lead_local_flood_authority,
          reservoirRisk: reservoirRisk,
          riverAndSeaRisk: riverAndSeaRisk,
          surfaceWaterRisk: risk.surface_water_risk,
          surfaceWaterSuitability: risk.surface_water_suitability,
          extraInfo: risk.extra_info
        }
        reply(response)
      })
    },
    validate: {
      params: {
        x: Joi.number().required(),
        y: Joi.number().required(),
        radius: Joi.number().required()
      }
    }
  }
}
