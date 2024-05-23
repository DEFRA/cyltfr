const boom = require('@hapi/boom')
const riskService = require('../services/risk')
const SurfaceWaterViewModel = require('../models/surface-water')
const errors = require('../models/errors.json')

module.exports = {
  method: 'GET',
  path: '/surface-water',
  handler: async (request, h) => {
    try {
      const address = request.yar.get('address')

      if (!address) {
        return h.redirect('/postcode')
      }

      const { x, y } = address
      const radius = 15
      const backLinkUri = '/risk'

      try {
        const risk = await riskService.getByCoordinates(x, y, radius)
        const surfaceWaterRisk = risk.surfaceWaterRisk || 'Very Low'

        if (!risk.inEngland) {
          return h.redirect('/england-only')
        } else {
          return h.view('surface-water', new SurfaceWaterViewModel(surfaceWaterRisk, address, risk.leadLocalFloodAuthority, backLinkUri))
        }
      } catch (err) {
        return boom.badRequest(errors.riskProfile.message, err)
      }
    } catch (err) {
      return boom.badRequest(errors.addressById.message, err)
    }
  },
  options: {
    description: 'Surface water risk description'
  }
}
