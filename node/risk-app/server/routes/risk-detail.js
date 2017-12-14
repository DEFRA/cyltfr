const Joi = require('joi')
const Boom = require('boom')
const riskService = require('../services/risk')
const addressService = require('../services/address')
const RiskViewModel = require('../models/risk-view')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/risk-detail',
  options: {
    description: 'Get risk detail page',
    handler: async (request, h) => {
      try {
        const address = await addressService.findById(request.query.address)

        const x = address.x
        const y = address.y
        const radius = 20

        try {
          const risk = await riskService.getByCoordinates(x, y, radius)

          // FLO-1139 If query 1 to 9 errors then throw default error page
          const errorMessage = 'Error'
          if (risk.inFloodWarningArea === errorMessage ||
          risk.inFloodAlertArea === errorMessage ||
          risk.riverAndSeaRisk === errorMessage ||
          risk.surfaceWaterRisk === errorMessage ||
          risk.reservoirRisk === errorMessage ||
          risk.surfaceWaterSuitability === errorMessage ||
          risk.leadLocalFloodAuthority === errorMessage ||
          risk.extraInfo === errorMessage) {
            return Boom.badRequest(errors.spatialQuery.message, {
              risk: risk,
              address: address
            })
          }

          if (!risk.inEngland) {
            return h.redirect('/?err=postcode')
          } else {
            return h.view('risk-detail', new RiskViewModel(risk, address))
          }
        } catch (err) {
          return Boom.badRequest(errors.riskProfile.message, err)
        }
      } catch (err) {
        return Boom.badRequest(errors.addressById.message, err)
      }
    },
    validate: {
      query: {
        address: Joi.number().required()
      }
    }
  }
}
