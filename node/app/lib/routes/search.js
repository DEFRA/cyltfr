var Joi = require('joi')
var Boom = require('boom')
var addressService = require('../services/address')

module.exports = {
  method: 'GET',
  path: '/search',
  config: {
    description: 'Get postcode search results',
    handler: function (request, reply) {
      var postcode = request.query.postcode

      addressService.findByPostcode(postcode, function (err, addresses) {
        if (err) {
          request.log('error', err)
          return reply(Boom.badRequest())
        }

        reply.view('search', {
          postcode: postcode,
          addresses: addresses
        })
      })
    },
    validate: {
      query: {
        postcode: Joi.string().required()
      }
    }
  }
}
