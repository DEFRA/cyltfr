const boom = require('@hapi/boom')
const riskService = require('../services/risk')
const RiskViewModel = require('../models/risk-view')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/risk',
  handler: async (request, h) => {
    try {
      const address = request.yar.get('address')

      if (!address) {
        return h.redirect('/postcode')
      }

      const { x, y } = address
      const radius = 15
      const pathRegex = /([^/]+$)/
      const backLinkUri = pathRegex.exec(request.info.referrer)
      try {
        const risk = await riskService.getByCoordinates(x, y, radius)
        // FLO-1139 If query 1 to 6 errors then throw default error page
        const hasError = risk.inFloodWarningArea === 'Error' ||
          risk.inFloodAlertArea === 'Error' ||
          risk.riverAndSeaRisk === 'Error' ||
          risk.surfaceWaterRisk === 'Error' ||
          risk.reservoirDryRisk === 'Error' ||
          risk.reservoirWetRisk === 'Error' ||
          risk.surfaceWaterSuitability === 'Error' ||
          risk.leadLocalFloodAuthority === 'Error' ||
          risk.extraInfo === 'Error'

        if (hasError) {
          return boom.badRequest(errors.spatialQuery.message, {
            risk,
            address
          })
        }

        if (!risk.inEngland) {
          return h.redirect('/england-only')
        } else {
          return h.view('risk', new RiskViewModel(risk, address, backLinkUri))
        }
      } catch (err) {
        return boom.badRequest(errors.riskProfile.message, err)
      }
    } catch (err) {
      return boom.badRequest(errors.addressById.message, err)
    }
  },
  options: {
    description: 'Get risk text page'
  }
}
