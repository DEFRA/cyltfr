const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const { postcodeRegex } = require('../helpers')
const floodService = require('../services/flood')
const addressService = require('../services/address')
const AddressViewModel = require('../models/address-model')
const errors = require('../models/errors.json')

module.exports = [{
  method: 'GET',
  path: '/address',
  handler: async (request, h) => {
    const { postcode } = request.query

    // Our Address service doesn't support NI addresses
    // but all NI postcodes start with BT so redirect to
    // "england-only" page if that's the case.
    if (postcode.toUpperCase().startsWith('BT')) {
      const encodedPostcode = encodeURIComponent(postcode)
      const url = `/england-only?postcode=${encodedPostcode}&region=northern-ireland`
      return h.redirect(url)
    }

    try {
      const addresses = await addressService.find(postcode)

      // Filter the english addresses
      const englishAddresses = addresses
        .filter(a => a.country !== 'WALES' && a.country !== 'SCOTLAND')
        .map(addr => ({ uprn: addr.uprn, address: addr.address }))

      if (!addresses || !addresses.length) {
        return h.view('address', new AddressViewModel(postcode))
      }

      // If there are no english addresses then
      // postcode must be in Scotland or Wales.
      if (!englishAddresses.length) {
        const firstAddress = addresses[0]
        let regionQueryString

        if (firstAddress.country === 'WALES') {
          regionQueryString = 'wales'
        } else if (firstAddress.country === 'SCOTLAND') {
          regionQueryString = 'scotland'
        }

        const encodedPostcode = encodeURIComponent(postcode)
        return h.redirect(`/england-only?postcode=${encodedPostcode}` +
          (regionQueryString && `&region=${regionQueryString}`))
      }

      const warnings = null // await floodService.findWarnings(postcode)

      return h.view('address', new AddressViewModel(postcode, englishAddresses, null, warnings))
    } catch (err) {
      return boom.badRequest(err.toString() + ' ' + errors.addressByPostcode.message)
    }
  },
  options: {
    plugins: {
      'hapi-rate-limit': {
        enabled: true
      }
    },
    validate: {
      query: {
        postcode: joi.string().trim().regex(postcodeRegex).required()
      }
    }
  }
}, {
  method: 'POST',
  path: '/address',
  handler: async (request, h) => {
    const { postcode } = request.query
    const { address, addresses } = request.payload

    if (!address) {
      const errorMessage = 'Select an address'
      const model = new AddressViewModel(postcode, addresses, errorMessage)
      return h.view('address', model)
    }

    return h.redirect(`/risk?address=${address}`)
  },
  options: {
    validate: {
      query: {
        postcode: joi.string().trim().regex(postcodeRegex).required()
      },
      payload: {
        address: joi.string().allow('').required(),
        addresses: joi.array().required().items(
          joi.object().keys({
            address: joi.string().required(),
            uprn: joi.string().required()
          })
        )
      }
    }
  }
}]
