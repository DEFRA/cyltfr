var Boom = require('boom')
var service = require('../service')

module.exports = function getFloodRisk (request, reply) {
  var db = request.pg.client
  var params = request.params

  service.calculateFloodRisk(db, params.x, params.y, params.radius, function (err, result) {
    if (err) {
      request.log('error', err)
      return reply(Boom.badRequest())
    }

    reply(result.rows)
  })
}
