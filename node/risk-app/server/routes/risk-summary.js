const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const riskService = require('../services/risk')
const addressService = require('../services/address')
const RiskViewModel = require('../models/risk-view')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/risk-summary',
  handler: async (request, h) => {
    try {
      const address = await addressService.findById(request.query.address)
      const x = address.x
      const y = address.y
      const radius = 20

      try {
        const risk = await riskService.getByCoordinates(x, y, radius)

        // FLO-1139 If query 1 to 6 errors then throw default error page
        const hasError = risk.inFloodWarningArea === 'Error' ||
          risk.inFloodAlertArea === 'Error' ||
          risk.riverAndSeaRisk === 'Error' ||
          risk.surfaceWaterRisk === 'Error' ||
          risk.reservoirRisk === 'Error'

        if (hasError) {
          return boom.badRequest(errors.spatialQuery.message, {
            risk: risk,
            address: address
          })
        }

        if (!risk.inEngland) {
          return h.redirect(`/england-only?uprn=${encodeURIComponent(address.uprn)}`)
        } else {
          return h.view('risk-summary', new RiskViewModel(risk, address))
        }
      } catch (err) {
        return boom.badRequest(errors.riskProfile.message, err)
      }
    } catch (err) {
      return boom.badRequest(errors.addressById.message, err)
    }
  },
  options: {
    description: 'Get risk text page',
    validate: {
      query: {
        address: joi.number().required()
      }
    }
  }
}
