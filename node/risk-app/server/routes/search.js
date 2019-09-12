const Joi = require('joi')
const Boom = require('boom')
const helpers = require('../helpers')
const addressService = require('../services/address')
const SearchViewModel = require('../models/search-view')
const errors = require('../models/errors.json')
const postcodeRegex = helpers.postcodeRegex

module.exports = [{
  method: 'GET',
  path: '/search',
  options: {
    description: 'Get postcode search results',
    handler: async (request, h) => {
      const query = request.query
      const postcode = query.postcode

      // Our Address service doesn't support NI addresses
      // but all NI postcodes start with BT so exit to the
      // "not-england" page if that's the case.
      if (postcode.toUpperCase().startsWith('BT')) {
        return h.redirect(`/england-only?postcode=${encodeURIComponent(postcode)}&region=northern-ireland`)
      }

      try {
        // Call the address service to find the matching addresses
        const addresses = await addressService.find(postcode)

        if (!addresses || !addresses.length) {
          return h.redirect(`/?err=notfound&postcode=${encodeURIComponent(postcode)}`)
        }

        // Filter the english addresses
        const englishAddresses = addresses.filter(a => (a.country !== 'WALES' && a.country !== 'SCOTLAND'))

        // If there are no english addresses, it must be in Scotland or Wales.
        if (!englishAddresses.length) {
          let regionQueryString = ''

          if (addresses[0].country === 'WALES') {
            regionQueryString = 'wales'
          } else if (addresses[0].country === 'SCOTLAND') {
            regionQueryString = 'scotland'
          }

          return h.redirect(`/england-only?postcode=${encodeURIComponent(postcode)}` +
            (regionQueryString && `&region=${regionQueryString}`))
        }

        return h.view('search', new SearchViewModel(postcode, englishAddresses))
      } catch (err) {
        return Boom.badRequest(errors.addressByPostcode.message, err)
      }
    },
    validate: {
      query: {
        postcode: Joi.string().trim().required().regex(postcodeRegex)
      }
    }
  }
}, {
  method: 'POST',
  path: '/search',
  config: {
    description: 'Post search results',
    handler: (request, h) => {
      const payload = request.payload
      const uprn = payload.uprn

      return h.redirect('/risk?address=' + uprn)
    },
    validate: {
      query: {
        postcode: Joi.string().trim().required().regex(postcodeRegex)
      },
      payload: {
        addresses: Joi.array().required().items(Joi.object().keys({
          address: Joi.string().required(),
          country: Joi.string().required(),
          postcode: Joi.string().required(),
          uprn: Joi.string().required()
        })),
        uprn: Joi.string().required()
      },
      failAction: function (request, h, error) {
        // Get the errors and prepare the model
        const errors = error.details
        const query = request.query || {}
        const payload = request.payload || {}
        const postcode = query.postcode

        // Save a lookup to address service again by
        // using the smuggled original address results
        const addresses = JSON.parse(payload.addresses)
        const model = new SearchViewModel(postcode, addresses, errors)

        // Respond with the view with errors
        return h.view('search', model).takeover()
      }
    }
  }
}]
