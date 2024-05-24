const riskService = require('../services/risk')
const boom = require('@hapi/boom')
const errors = require('../models/errors.json')
const GroundWaterViewModel = require('../models/ground-water-view')
const config = require('../config')

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

    if (config.riskPageFlag) {
      try {
        const risk = await riskService.getByCoordinates(x, y, radius)
        console.log(risk)
        const groundWaterRisk = risk.isGroundwaterArea
        const reservoirDryRisk = !!(risk.reservoirDryRisk && risk.reservoirDryRisk.length)
        const reservoirWetRisk = !!(risk.reservoirWetRisk && risk.reservoirWetRisk.length)
        const reservoirRisk = reservoirDryRisk || reservoirWetRisk
        const reservoirs = []

        if (reservoirRisk) {
          console.log('here')
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
          if (reservoirWetRisk) {
            risk.reservoirWetRisk.forEach(function (item) {
              const exists = !!reservoirs.find(r => r.location === item.location)
              if (!exists) {
                add(item)
              }
            })
          }
        }
        console.log(reservoirs)

        const model = new GroundWaterViewModel(reservoirRisk, groundWaterRisk, reservoirs, address, backLinkUri)
        return h.view('ground-water', model)
      } catch (err) {
        return boom.badRequest(errors.riskProfile.message, err)
      }
    } else {
      return boom.forbidden(errors.pageNotAvailable.message)
    }
  },
  options: {
    description: 'Understand rivers and the sea page'
  }
}
