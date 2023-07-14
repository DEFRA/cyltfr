const joi = require('joi')
const boom = require('@hapi/boom')
const { postcodeRegex, redirectToHomeCounty } = require('../helpers')
const config = require('../config')
const { friendlyCaptchaSecretKey, friendlyCaptchaUrl, friendlyCaptchaEnabled } = config
const floodService = require('../services/flood')
const addressService = require('../services/address')
const SearchViewModel = require('../models/search-view')
const errors = require('../models/errors.json')
const util = require('../util')

async function getWarnings (postcode, request) {
  // Don't let an error raised during the call
  // to get the warnings cause the page to fail
  try {
    return await floodService.findWarnings(postcode)
  } catch (err) {
    request.log('error', err)
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/search',
    handler: async (request, h) => {
      const { postcode, token } = request.query
      const url = '/postcode'
      if (friendlyCaptchaEnabled) {
        if (!request.yar.get('captchabypass')) {
          if (token === 'undefined') {
            return boom.badRequest(errors.javascriptError.message)
          }
          if (token === '.EXPIRED') {
            return boom.badRequest(errors.friendlyCaptchaError.message)
          }
          if (!token) {
            return h.redirect(url)
          }
          if (captchaEnabled) {
            // Check that Recaptcha v3 token is valid and has not been used before
            const uri = `${config.captchaUrl}${config.captchaSecretKey}&response=${token}`
            const payload = await util.postJson(uri, true)
            if (!payload || !payload.success || payload.score <= 0.5) {
              if (!payload.success) {
                return h.redirect(url)
              } else {
                return boom.badRequest(errors.captchaError.message)
              }
            }
          }
          if (friendlyCaptchaEnabled && (request.yar.get('token') === undefined || request.yar.get('token') === null)) {
            console.log('Verifying FriendlyCaptcha')
            const uri = `${friendlyCaptchaUrl}`
            const requestData = {
              solution: token,
              secret: friendlyCaptchaSecretKey
            }
            const options = {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
              },
              json: true,
              payload: requestData
            }
            const apiResponse = await util.post(uri, options, true)
            if (!apiResponse.success && apiResponse.errors[0] === 'solution_invalid') {
              console.log('The solution you provided was invalid (perhaps the user tried to tamper with the puzzle).')
              return boom.badImplementation('solution_invalid')
            }
            if (!apiResponse.success && apiResponse.errors[0] === 'solution_timeout_or_duplicate') {
              return boom.badRequest(errors.sessionTimeoutError.message)
            }
          }
        } else {
          console.log('Captcha bypass enabled')
        }
      }

      // Our Address service doesn't support NI addresses
      // but all NI postcodes start with BT so redirect to
      // "england-only" page if that's the case.
      if (postcode.toUpperCase().startsWith('BT')) {
        return redirectToHomeCounty(h, postcode, 'northern-ireland')
      }

      try {
        const addresses = await addressService.find(postcode)

        // Set addresses to session
        request.yar.set({
          addresses
        })

        if (!addresses || !addresses.length) {
          return h.view('search', new SearchViewModel(postcode))
        }
        const warnings = await getWarnings(postcode, request)

        return h.view('search', new SearchViewModel(postcode, addresses, null, warnings))
      } catch (err) {
        return boom.badRequest(errors.addressByPostcode.message, err)
      }
    },
    options: {
      description: 'Get the search page',
      plugins: {
        'hapi-rate-limit': {
          enabled: config.rateLimitEnabled
        }
      },
      validate: {
        query: joi.object().keys({
          postcode: joi.string().trim().regex(postcodeRegex).required(),
          token: joi.string().optional()
        }).required()
      }
    }
  },
  {
    method: 'POST',
    path: '/search',
    handler: async (request, h) => {
      const { postcode, token } = request.query
      const { address } = request.payload
      const addresses = request.yar.get('addresses')

      if (!Array.isArray(addresses)) {
        return h.redirect('/postcode')
      }
      // Set friendly captchaa token to session
      request.yar.set({
        token: friendlyCaptchaEnabled ? postcode + token : undefined
      })
      let errorMessage
      if (address < 0) {
        errorMessage = 'Select an address'
        if (addresses.length <= 0) {
          errorMessage = 'Enter a valid postcode'
        }
        const warnings = await getWarnings(postcode, request)
        const model = new SearchViewModel(postcode, addresses, errorMessage, warnings)

        return h.view('search', model)
      }
      // Set addresses to session
      request.yar.set({
        address: addresses[address]
      })

      return h.redirect('/risk')
    },
    options: {
      description: 'Post to the search page',
      validate: {
        query: joi.object().keys({
          postcode: joi.string().trim().regex(postcodeRegex).required(),
          token: joi.string().optional()
        }),
        payload: joi.object().keys({
          address: joi.number().required()
        })
      }
    }
  }
]
