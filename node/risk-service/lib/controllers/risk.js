var Boom = require('boom')
var service = require('../service')

module.exports = function getFloodRisk (request, reply) {
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
      reservoirRisk = {
        reservoirName: risk.reservoir_risk.resname,
        location: risk.reservoir_risk.location,
        riskDesignation: risk.reservoir_risk.risk_desig,
        isUtilityCompany: risk.reservoir_risk.utcompany,
        leadLocalFloodAuthority: risk.reservoir_risk.llfa_name,
        environmentAgencyArea: risk.reservoir_risk.ea_area,
        comments: risk.reservoir_risk.comments
      }
    }

    if (risk.rofrs_risk) {
      riverAndSeaRisk = {
        probabilityForBand: risk.rofrs_risk.prob_4band,
        suitability: risk.rofrs_risk.suitability,
        riskForInsuranceSOP: risk.rofrs_risk.risk_for_insurance_sop
      }
    }

    var response = {
      inFloodAlertArea: risk.in_flood_alert_area,
      inFloodWarningArea: risk.in_flood_warning_area,
      leadLocalFloodAuthority: risk.lead_local_flood_authority,
      reservoirRisk: reservoirRisk,
      riverAndSeaRisk: riverAndSeaRisk,
      surfaceWaterRisk: risk.surface_water_risk,
      surfaceWaterSuitability: risk.surface_water_suitability
    }

    reply(response)
  })
}
