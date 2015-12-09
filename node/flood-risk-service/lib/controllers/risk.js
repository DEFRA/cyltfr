var Boom = require('boom')
var service = require('../service')

module.exports = function getFloodRisk (request, reply) {
  var db = request.pg.client
  var params = request.params

  service.calculateFloodRisk(db, params.x, params.y, params.radius, function (err, result) {
    if (err) {
      request.log('error', err)
      return reply(Boom.badRequest('Database call failed'))
    }

    if (!result || !Array.isArray(result.rows) || result.rows.length !== 1) {
      request.log('error', new Error('Invalid result'))
      return reply(Boom.badRequest('Invalid result'))
    }

    var response = result.rows.map(function (item) {
      var risk = item.calculate_flood_risk
      return {
        inFloodAlertArea: risk.in_flood_alert_area,
        inFloodWarningArea: risk.in_flood_warning_area,
        leadLocalFloodAuthority: risk.lead_local_flood_authority,
        reservoirRisk: risk.reservoir_risk,
        riversAndSeasRisk: risk.rofrs_risk,
        surfaceWaterRisk: risk.surface_water_risk,
        surfaceWaterSuitability: risk.surface_water_suitability
      }
    })[0]

    reply(response)
  })
}
