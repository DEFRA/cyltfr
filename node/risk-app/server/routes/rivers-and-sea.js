const riskService = require('../services/risk')
const RiversAndSeaModel = require('../models/rivers-and-sea')

module.exports = {
  method: 'GET',
  path: '/rivers-and-sea',
  handler: async (request, h) => {
    const address = request.yar.get('address')
    console.log('addess: ', address)
    const { x, y } = address
    const radius = 15

    const backLinkUri = '/risk'
    if (!address) {
      return h.redirect('/postcode')
    }

    const risk = await riskService.getByCoordinates(x, y, radius)
    const riskProbability = risk.riverAndSeaRisk.probabilityForBand
    const model = new RiversAndSeaModel(riskProbability, address, backLinkUri)

    return h.view('rivers-and-sea', model)
  },
  options: {
    description: 'Understand rivers and the sea page'
  }
}
