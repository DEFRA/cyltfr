const joi = require('@hapi/joi')
const { postcodeRegex } = require('../helpers')
const HomeViewModel = require('../models/home-view')

module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return h.view('home', new HomeViewModel())
    }
  },
  {
    method: 'POST',
    path: '/',
    handler: async (request, h) => {
      const { postcode } = request.payload

      if (!postcode || !postcode.match(postcodeRegex)) {
        const errorMessage = 'Enter a full postcode in England'
        const model = new HomeViewModel(postcode, errorMessage)
        return h.view('home', model)
      }

      // Our Address service doesn't support NI addresses
      // but all NI postcodes start with BT so redirect to
      // "england-only" page if that's the case.
      if (postcode.toUpperCase().startsWith('BT')) {
        const url = `/england-only?postcode=${encodeURIComponent(postcode)}&region=northern-ireland`
        return h.redirect(url)
      }

      const url = `/search?postcode=${encodeURIComponent(postcode)}`
      return h.redirect(url)
    },
    options: {
      validate: {
        payload: {
          postcode: joi.string().trim().required().allow('')
        }
      }
    }
  }
]
