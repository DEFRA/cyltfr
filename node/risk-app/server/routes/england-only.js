var Joi = require('joi')
var helpers = require('../helpers')
var postcodeRegex = helpers.postcodeRegex

module.exports = {
  method: 'GET',
  path: '/england-only',
  config: {
    description: 'Get the england only page',
    handler: function (request, reply) {
      var model = {
        isWales: request.query.region === 'wales',
        isScotland: request.query.region === 'scotland',
        isNorthernIreland: request.query.region === 'northern-ireland'
      }

      reply.view('england-only', model)
    },
    validate: {
      query: {
        region: Joi.string().allow('', 'wales', 'northern-ireland', 'scotland'),
        premises: Joi.string().trim().required().max(100),
        postcode: Joi.string().trim().required().regex(postcodeRegex)
      }
    }
  }
}
