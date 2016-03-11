var Joi = require('joi')
var Boom = require('boom')
var riskService = require('../services/risk')
var addressService = require('../services/address')
var RiskViewModel = require('../models/risk-view')

module.exports = {
  method: 'GET',
  path: '/risk',
  config: {
    description: 'Get risk text page',
    handler: function (request, reply) {
      addressService.findById(request.query.address, function (err, address) {
        if (err) {
          return reply(Boom.badRequest('An error occurred finding the address by id', err))
        }

        var singleAddress = address[0].DPA
        var x = singleAddress.X_COORDINATE
        var y = singleAddress.Y_COORDINATE
        var radius = 10

        riskService.getByCoordinates(x, y, radius, function (err, risk) {
          if (err) {
            return reply(Boom.badRequest('An error occurred finding getting the risk profile', err))
          }
          console.log(risk)
          reply.view('risk', new RiskViewModel(risk, singleAddress))
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
