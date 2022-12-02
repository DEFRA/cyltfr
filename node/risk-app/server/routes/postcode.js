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
      let url
      let friendlyRecaptcha
      if (config.captchaEnabled) {
        const captcha = request.payload['g-recaptcha-response']
        url = `/search?postcode=${encodeURIComponent(postcode)}&token=${encodeURIComponent(captcha)}`
      } else if (config.friendlyCaptchaEnabled) {
        friendlyRecaptcha = request.orig.payload['frc-captcha-solution']

        if (!friendlyRecaptcha || friendlyRecaptcha === 'undefined' || friendlyRecaptcha === '.FETCHING' ||
        friendlyRecaptcha === '.UNSTARTED' || friendlyRecaptcha === '.UNFINISHED') {
          const captchaErrorMessage = 'You cannot continue until Friendly Captcha has checked that you\'re not a robot'
          const model = new PostcodeViewModel(postcode, captchaErrorMessage)
          return h.view('postcode', model)
        }
        url = `/search?postcode=${encodeURIComponent(postcode)}&token=${encodeURIComponent(friendlyRecaptcha)}`
      } else {
        url = `/search?postcode=${encodeURIComponent(postcode)}`
      }

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

      return h.redirect(url)
      // return h.view('postcode', new PostcodeViewModel())
    },
    options: {
      description: 'Post to the postcode page',
      validate: {
        payload: joi.object().keys({
          postcode: joi.string().trim().required().allow('')
          // 'g-recaptcha-response': joi.string()
        }).required()
      }
    }
  }
]
