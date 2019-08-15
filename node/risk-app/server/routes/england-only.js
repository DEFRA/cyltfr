const Joi = require('@hapi/joi')
const helpers = require('../helpers')
const postcodeRegex = helpers.postcodeRegex

module.exports = {
  method: 'GET',
  path: '/england-only',
  options: {
    description: 'Get the england only page',
    handler: (request, h) => {
      const model = {
        isWales: request.query.region === 'wales',
        isScotland: request.query.region === 'scotland',
        isNorthernIreland: request.query.region === 'northern-ireland'
      }

      return h.view('england-only', model)
    },
    validate: {
      query: {
        region: Joi.string().allow('', 'wales', 'northern-ireland', 'scotland'),
        premises: Joi.string().trim().max(100),
        postcode: Joi.string().trim().regex(postcodeRegex),
        uprn: Joi.string().allow('')
      }
    }
  }
}
