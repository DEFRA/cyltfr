const config = require('../config')
const joi = require('joi')
const { postcodeRegex, redirectToHomeCounty } = require('../helpers')
const PostcodeViewModel = require('../models/postcode-view')

module.exports = [
  {
    method: 'GET',
    path: '/postcode',
    handler: (request, h) => {
      return h.view('postcode', new PostcodeViewModel())
    },
    options: {
      description: 'Get the postcode page'
    }
  },
  {
    method: 'POST',
    path: '/postcode',
    handler: async (request, h) => {
      const { postcode } = request.payload
      const recaptcha = request.payload['g-recaptcha-response']

      if (!postcode || !postcode.match(postcodeRegex)) {
        const errorMessage = 'Enter a full postcode in England'
        const model = new PostcodeViewModel(postcode, errorMessage)
        return h.view('postcode', model)
      }

      // Our Address service doesn't support NI addresses
      // but all NI postcodes start with BT so redirect to
      // "england-only" page if that's the case.
      if (postcode.toUpperCase().startsWith('BT')) {
        return redirectToHomeCounty(h, postcode, 'northern-ireland')
      }
      let url
      if (config.captchaEnabled) {
        url = `/search?postcode=${encodeURIComponent(postcode)}&token=${encodeURIComponent(recaptcha)}`
      } else {
        url = `/search?postcode=${encodeURIComponent(postcode)}`
      }

      return h.redirect(url)
    },
    options: {
      description: 'Post to the postcode page',
      validate: {
        payload: joi.object().keys({
          postcode: joi.string().trim().required().allow(''),
          'g-recaptcha-response': joi.string()
        }).required()
      }
    }
  }
]
