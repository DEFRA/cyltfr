const config = require('../config')
const joi = require('joi')
const { postcodeRegex, redirectToHomeCounty } = require('../helpers')
const PostcodeViewModel = require('../models/postcode-view')
const errors = require('../models/errors.json')
const boom = require('@hapi/boom')

module.exports = [
  {
    method: 'GET',
    path: '/postcode',
    handler: (request, h) => {
      const { state = {} } = request
      const { activity = {} } = state
      activity.session = 'active'
      h.state('activity', activity)
      if( config.friendlyCaptchaEnabled )
        return h.view('postcode', new PostcodeViewModel(null,null,config.sessionTimeout))
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
        friendlyRecaptcha = request.payload['frc-captcha-solution']
        // throw error for user inactivity
        if (!request.state.activity) {
          return boom.badRequest(errors.sessionTimeoutError.message)
        }

        if (!friendlyRecaptcha || friendlyRecaptcha === 'undefined' || friendlyRecaptcha === '.FETCHING' ||
        friendlyRecaptcha === '.UNSTARTED' || friendlyRecaptcha === '.UNFINISHED') {
          const captchaErrorMessage = 'You cannot continue until Friendly Captcha'+ 
          ' has checked that you\'re not a robot'
          const model = new PostcodeViewModel(postcode, captchaErrorMessage,config.sessionTimeout)
          return h.view('postcode', model)
        }
        url = `/search?postcode=${encodeURIComponent(postcode)}&token=${encodeURIComponent(friendlyRecaptcha)}`
      } else {
        url = `/search?postcode=${encodeURIComponent(postcode)}`
      }

      if (!postcode || !postcode.match(postcodeRegex)) {
        const errorMessage = 'Enter a full postcode in England'
        const model = new PostcodeViewModel(postcode, errorMessage,config.sessionTimeout)
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
          postcode: joi.string().trim().required().allow(''),
          'g-recaptcha-response': joi.string(),
          'frc-captcha-solution': joi.string()
        }).required()
      }
    }
  }
]
