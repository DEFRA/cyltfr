var Joi = require('joi')
var Boom = require('boom')
var service = require('../services')

module.exports = {
  method: 'GET',
  path: '/is-england/{x}/{y}',
  config: {
    description: 'Check if coordinates are in england',
    handler: function (request, reply) {
      var db = request.pg.client
      var params = request.params

      service.isEngland(db, params.x, params.y, function (err, result) {
        if (err) {
          return reply(Boom.badRequest('Failed to get isEngland', err))
        }

        reply(result.rows[0])
      })
    },
    validate: {
      params: {
        x: Joi.number().required(),
        y: Joi.number().required()
      }
    }
  }
}
