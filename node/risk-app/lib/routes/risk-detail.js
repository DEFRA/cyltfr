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

          // FLO-1139 If query 1 to 9 errors then throw default error page
          if (risk.inFloodWarningArea === 'Error' ||
          risk.inFloodAlertArea === 'Error' ||
          risk.riverAndSeaRisk === 'Error' ||
          risk.surfaceWaterRisk === 'Error' ||
          risk.reservoirRisk === 'Error' ||
          risk.surfaceWaterSuitability === 'Error' ||
          risk.leadLocalFloodAuthority === 'Error' ||
          risk.extraInfo === 'Error') {
            return reply(Boom.badRequest('An error occurred with the spatial query', { address: address, risk: risk }))
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
