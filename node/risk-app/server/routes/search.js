var Joi = require('joi')
var Boom = require('boom')
var helpers = require('../helpers')
var addressService = require('../services/address')
var SearchViewModel = require('../models/search-view')
var errors = require('../models/errors.json')
var postcodeRegex = helpers.postcodeRegex

module.exports = [{
  method: 'GET',
  path: '/search',
  config: {
    description: 'Get postcode search results',
    handler: function (request, reply) {
      var query = request.query
      var premises = query.premises
      var postcode = query.postcode

      // Our Address service doesn't support NI addresses
      // but all NI postcodes start with BT so exit to the
      // "not-england" page if that's the case.
      if (postcode.toUpperCase().startsWith('BT')) {
        return reply.redirect(`/england-only?premises=${encodeURIComponent(premises)}&postcode=${encodeURIComponent(postcode)}&region=northern-ireland`)
      }

      // Call the address service to find the matching addresses
      addressService.find(premises, postcode, function (err, addresses) {
        if (err) {
          return reply(Boom.badRequest(errors.addressByPremisesAndPostcode.message, err))
        }

        if (!addresses || !addresses.length) {
          return reply.redirect(`/?err=notfound&premises=${encodeURIComponent(premises)}&postcode=${encodeURIComponent(postcode)}`)
        }

        // Filter the english addresses
        const englishAddresses = addresses.filter(a => a.country === 'ENGLAND')

        // If there are no english addresses, it must be in Scotland or Wales.
        if (!englishAddresses.length) {
          var regionQueryString = ''
          if (addresses[0].country === 'WALES') {
            regionQueryString = 'wales'
          } else if (addresses[0].country === 'SCOTLAND') {
            regionQueryString = 'scotland'
          }

          return reply.redirect(`/england-only?premises=${encodeURIComponent(premises)}&postcode=${encodeURIComponent(postcode)}` +
            (regionQueryString && `&region=${regionQueryString}`))
        }

        reply.view('search', new SearchViewModel(premises, postcode, englishAddresses))
      })
    },
    validate: {
      query: {
        premises: Joi.string().trim().required().max(100),
        postcode: Joi.string().trim().required().regex(postcodeRegex)
      }
    }
  }
}, {
  method: 'POST',
  path: '/search',
  config: {
    description: 'Post search results',
    handler: function (request, reply) {
      var payload = request.payload
      var uprn = payload.uprn

      reply.redirect('/risk?address=' + uprn)
    },
    validate: {
      query: {
        premises: Joi.string().trim().required().max(100),
        postcode: Joi.string().trim().required().regex(postcodeRegex)
      },
      payload: {
        uprn: Joi.string().required(),
        addresses: Joi.array().required()
      },
      failAction: function (request, reply, source, error) {
        // Get the errors and prepare the model
        var errors = error.data.details
        var query = request.query || {}
        var payload = request.payload || {}
        var premises = query.premises
        var postcode = query.postcode

        // Save a lookup to address service again by
        // using the smuggled original address results
        var addresses = payload.addresses

        // Respond with the view with errors
        reply.view('search', new SearchViewModel(premises, postcode, addresses, errors))
      }
    }
  }
}]

