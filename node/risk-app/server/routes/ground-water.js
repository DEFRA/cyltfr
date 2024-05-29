const riskService = require('../services/risk')
const boom = require('@hapi/boom')
const errors = require('../models/errors.json')
const GroundWaterViewModel = require('../models/ground-water-view')

module.exports = {
  method: 'GET',
  path: '/ground-water',
  handler: async (request, h) => {
    const address = request.yar.get('address')

    if (!address) {
      return h.redirect('/postcode')
    }

    const { x, y } = address
    const radius = 15
    const backLinkUri = '/risk'

    try {
      const risk = await riskService.getByCoordinates(x, y, radius)
      const groundWaterRisk = risk.isGroundwaterArea
      const reservoirDryRisk = !!(risk.reservoirDryRisk?.length)
      const reservoirWetRisk = !!(risk.reservoirWetRisk?.length)
      const reservoirRisk = reservoirDryRisk || reservoirWetRisk
      const reservoirs = []

      if (reservoirRisk) {
        const add = function (item) {
          reservoirs.push({
            name: item.reservoirName,
            owner: item.undertaker,
            authority: item.leadLocalFloodAuthority,
            location: item.location,
            riskDesignation: item.riskDesignation,
            comments: item.comments
          })
        }
        if (reservoirDryRisk) {
          risk.reservoirDryRisk.forEach(add)
        }
        // Checks to see if any of the wet reservoirs is not already noted
        // from the dry reservoirs, if it isn't then it is added to the array.
        if (reservoirWetRisk) {
          risk.reservoirWetRisk
            .filter(item => !reservoirs.find(r => r.location === item.location))
            .forEach(item => add(item))
        }
      }

      const model = new GroundWaterViewModel(reservoirRisk, groundWaterRisk, reservoirs, address, backLinkUri)
      return h.view('ground-water', model)
    } catch (err) {
      return boom.badRequest(errors.riskProfile.message, err)
    }
  },
  options: {
    description: 'Understand rivers and the sea page'
  }
}
