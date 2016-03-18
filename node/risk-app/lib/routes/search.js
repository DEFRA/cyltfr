var Joi = require('joi')
var Boom = require('boom')
var floodService = require('../services/flood')
var addressService = require('../services/address')
var SearchViewModel = require('../models/search-view')

module.exports = {
  method: 'GET',
  path: '/search',
  config: {
    description: 'Get postcode search results',
    handler: function (request, reply) {
      var postcode = request.query.postcode
      var validPostcode = postcode.toUpperCase().replace(' ', '')
      var postcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi

      if (!postcodeRegex.test(postcode)) {
        return reply.redirect('/?err=postcode')
      }

      addressService.findByPostcode(validPostcode, function (err, addresses) {
        if (err) {
          return reply(Boom.badRequest('Failed to find addresses by postcode', err))
        }

        floodService.findWarnings(validPostcode, function (err, warnings) {
          if (err) {
            request.log('error', err)
          }

          reply.view('search', new SearchViewModel(postcode, addresses, warnings))
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
