var Joi = require('joi')
var Boom = require('boom')
var riskService = require('../services/risk')
var addressService = require('../services/address')
var RiskViewModel = require('../models/risk-view')

module.exports = {
  method: 'GET',
  path: '/risk-detail',
  config: {
    description: 'Get risk detail page',
    handler: function (request, reply) {
      addressService.findById(request.query.address, function (err, address) {
        if (err) {
          return reply(Boom.badRequest('An error occurred finding the address by id', err))
        }

        var x = address.x
        var y = address.y
        var radius = 10
        riskService.getByCoordinates(x, y, radius, function (err, risk) {
          if (err) {
            return reply(Boom.badRequest('An error occurred finding getting the risk profile', err))
          }

          if (!risk.inEngland) {
            reply.redirect('/?err=postcode')
          } else {
            reply.view('risk-detail', new RiskViewModel(risk, address))
          }
        })
      })
    },
    validate: {
      query: {
        address: Joi.number().required()
      }
    }
  }
}
