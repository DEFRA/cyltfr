const joi = require('joi')
const config = require('../config')
const sndPassword = require('../services/snd-password')

module.exports = [
  {
    method: 'GET',
    path: '/sandpit-login',
    handler: async (request, h) => {
      return h.view('sandpit-login')
    },
    options: {
      description: 'Get Login Page',
      auth: {
        strategy: 'session',
        mode: 'try'
      },
      validate: {
        query: joi.object({
          updated: joi.boolean().default(false)
        }).required()
      }
    }
  },
  {
    method: 'POST',
    path: '/sandpit-login',
    handler: async (request, h) => {
      const { username, password, generate, url } = request.payload
      let isAdmin = false
      const destination = '/postcode'

      if ((password) && (password === config.authcookie.sitepassword) && (username === config.authcookie.siteusername)) {
        isAdmin = true
        request.yar.set('isAdmin', true)
        request.cookieAuth.set({ isAdmin: true })
        console.log('request.cookieAuth', request.cookieAuth)
      } else if (password) {
        request.yar.set('isAdmin', '')
        request.cookieAuth.clear()
      }
      return h.redirect(destination)
    },
    options: {
      description: 'Submit Login Page',
      auth: {
        strategy: 'session',
        mode: 'try'
      }
    }
  }
]
