const joi = require('joi')
const boom = require('@hapi/boom')
const { postcodeRegex, redirectToHomeCounty } = require('../helpers')
const config = require('../config')
const { captchaEnabled, friendlyCaptchaSecretKey, friendlyCaptchaUrl, friendlyCaptchaEnabled } = config
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
      const { postcode } = request.query
      const url = '/postcode'
      const { token } = request.query
      if (captchaEnabled || friendlyCaptchaEnabled) {
        if (token === 'undefined') {
          return boom.badRequest(errors.javascriptError.message)
        }
        if (!token) {
          return h.redirect(url)
        }
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
      if (friendlyCaptchaEnabled) {
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
        if (!apiResponse.success && apiResponse.errors.solution_invalid) {
          console.log('The solution you provided was invalid (perhaps the user tried to tamper with the puzzle).')
          return boom.badImplementation('solution_invalid')
        }
        if (!apiResponse.success && apiResponse.errors.solution_timeout_or_duplicate) {
          return boom.badRequest(errors.friendlyCaptchaError.message)
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

        if (!addresses || !addresses.length) {
          return h.view('search', new SearchViewModel(postcode))
        }

        const warnings = await getWarnings(postcode, request)

        // Set addresses to session
        request.yar.set({
          addresses
        })

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
      const { postcode } = request.query
      const { address } = request.payload
      const addresses = request.yar.get('addresses')

      if (!Array.isArray(addresses)) {
        return h.redirect('/postcode')
      }

      if (address < 0) {
        const errorMessage = 'Select an address'
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
          postcode: joi.string().trim().regex(postcodeRegex).required()
        }),
        payload: joi.object().keys({
          address: joi.number().required()
        })
      }
    }
  }
]
