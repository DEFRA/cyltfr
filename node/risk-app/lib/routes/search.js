var Joi = require('joi')
var Boom = require('boom')
var addressService = require('../services/address')
var HomeViewModel = require('../models/home-view')
var SearchViewModel = require('../models/search-view')

module.exports = {
  method: 'GET',
  path: '/search',
  config: {
    description: 'Get postcode search results',
    handler: function (request, reply) {
      var postcode = request.query.postcode
      addressService.findByPostcode(postcode, function (err, addresses) {
        if (err) {
          return reply(Boom.badRequest('Failed to find addresses by postcode', err))
        }
        if (addresses == null) {
          reply.view('home', new HomeViewModel('Please enter a valid postcode in England'))
        } else {
          reply.view('search', new SearchViewModel(postcode, addresses))
        }
      })
    },
    validate: {
      query: {
        postcode: Joi.string().required()
      }
    }
  }
}
