const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const { postcodeRegex } = require('../helpers')
const addressService = require('../services/address')

class AddressModel {
  constructor (postcode, addresses = [], errorMessage) {
    this.postcode = postcode

    const defaultOption = {
      text: addresses.length === 1
        ? '1 address found'
        : `${addresses.length} addresses found`
    }

    const items = [defaultOption].concat(addresses.map(addr => ({
      text: addr.address,
      value: addr.uprn
    })))

    this.addressSelect = {
      id: 'address',
      name: 'address',
      label: {
        text: 'Select an address'
      },
      items
    }

    if (errorMessage) {
      this.addressSelect.errorMessage = {
        text: errorMessage
      }
    }

    this.addresses = JSON.stringify(addresses)
  }
}

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
        return h.view('address', new AddressModel(postcode))
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

      return h.view('address', new AddressModel(postcode, englishAddresses))
    } catch (err) {
      return boom.badRequest('An error occurred finding the address')
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
      const model = new AddressModel(postcode, addresses, errorMessage)
      return h.view('address', model)
    }

    return h.redirect(`/risk-summary?address=${address}`)
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
