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
        let riskProbability
        const risk = await riskService.getByCoordinates(x, y, radius)
        console.log(risk)
        if (risk.riverAndSeaRisk) {
          riskProbability = risk.riverAndSeaRisk.probabilityForBand
        } else {
          riskProbability = 'Very low'
        }
        const model = new GroundWaterViewModel(riskProbability, address, backLinkUri)
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
