const joi = require('joi')
const { defineBackLink } = require('../services/defineBackLink')

module.exports = {
  method: 'GET',
  path: '/england-only',
  handler: async (request, h) => {
    const address = request.yar.get('address')
    if (address === null) {
      return h.redirect('/postcode')
    }
    const path = request.path
    const backLink = defineBackLink(path, address.postcode)
    const model = {
      isWales: request.query.region === 'wales',
      isScotland: request.query.region === 'scotland',
      isNorthernIreland: request.query.region === 'northern-ireland',
      backLink
    }

    return h.view('england-only', model)
  },
  options: {
    description: 'Get the england only page',
    validate: {
      query: joi.object().keys({
        region: joi.string().allow('', 'wales', 'northern-ireland', 'scotland'),
        premises: joi.string().allow(''),
        postcode: joi.string().allow('')
      }).required()
    }
  }
}
