var Joi = require('joi')
var Boom = require('boom')
var riskService = require('../services/risk')
var addressService = require('../services/address')
var RiskViewModel = require('../models/risk-view')

module.exports = {
  method: 'POST',
  path: '/risk',
  config: {
    description: 'Get risk text page',
    handler: function (request, reply) {
      addressService.findById(request.payload.address, function (err, address) {
        if (!err) {
          request.log('error', err)
          return reply(Boom.badRequest())
        }

        var x = address.easting
        var y = address.northing
        var radius = 10

        riskService.getByCoordinates(x, y, radius, function (err, risk) {
          if (err) {
            request.log('error', err)
            return reply(Boom.badRequest())
          }

          reply.view('risk', new RiskViewModel(risk, address))
        })
      })
    },
    validate: {
      payload: {
        address: Joi.objectId().required()
      }
    }
  }
}
