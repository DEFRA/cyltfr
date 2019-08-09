const Joi = require('joi')
const Boom = require('boom')
const service = require('../services')

module.exports = {
  method: 'GET',
  path: '/floodrisk/{x}/{y}/{radius}',
  options: {
    description: 'Get the long term flood risk associated with a point. Surface water risk is calculated based on a radius (metres) buffered point in polygon search.',
    handler: async (request, h) => {
      const params = request.params

      try {
        const result = await service.calculateFloodRisk(params.x, params.y, params.radius)

        /*
         * Do some assertions around the result we get back from the database
         */
        if (!result || !Array.isArray(result.rows) || result.rows.length !== 1) {
          return Boom.badRequest('Invalid result', new Error('Expected an Array'))
        }

        const risk = result.rows[0].calculate_flood_risk

        if (!risk) {
          return Boom.badRequest('Invalid result', new Error('Missing calculate_flood_risk key'))
        }

        /*
         * If we get here we can be sure we have a valid result from
         * the database and we can start to prepare our return response
         */
        let reservoirRisk = null
        let riverAndSeaRisk = null

        if (risk.reservoir_risk && risk.reservoir_risk !== 'Error') {
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
        } else {
          reservoirRisk = risk.reservoir_risk
        }

        if (risk.rofrs_risk) {
          riverAndSeaRisk = {
            probabilityForBand: risk.rofrs_risk.prob_4band,
            suitability: risk.rofrs_risk.suitability,
            riskForInsuranceSOP: risk.rofrs_risk.risk_for_insurance_sop
          }
        }

        let isGroundwaterArea = false
        const floodAlertArea = Array.isArray(risk.flood_alert_area) ? risk.flood_alert_area : []
        const floodWarningArea = Array.isArray(risk.flood_warning_area) ? risk.flood_warning_area : []

        if (floodAlertArea.find((faa) => faa.charAt(5) === 'G')) {
          isGroundwaterArea = true
        } else if (floodWarningArea.find((fwa) => fwa.charAt(5) === 'G')) {
          isGroundwaterArea = true
        }

        const response = {
          inEngland: risk.in_england,
          isGroundwaterArea: isGroundwaterArea,
          floodAlertArea: floodAlertArea,
          floodWarningArea: floodWarningArea,
          inFloodAlertArea: risk.flood_alert_area === 'Error' ? 'Error' : floodAlertArea.length > 0,
          inFloodWarningArea: risk.flood_warning_area === 'Error' ? 'Error' : floodWarningArea.length > 0,
          leadLocalFloodAuthority: risk.lead_local_flood_authority,
          reservoirRisk: reservoirRisk,
          riverAndSeaRisk: riverAndSeaRisk,
          surfaceWaterRisk: risk.surface_water_risk,
          surfaceWaterSuitability: risk.surface_water_suitability,
          extraInfo: risk.extra_info
        }

        return response
      } catch (err) {
        return Boom.badRequest('Database call failed', err)
      }
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
