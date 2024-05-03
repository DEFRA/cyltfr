const joi = require('joi')
const config = require('../config')
const sndPassword = require('../services/snd-password')

module.exports = [
  {
    method: 'GET',
    path: '/sandpit-login',
    handler: async (_request, h) => {
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
      const { username, password } = request.payload
      let isAdmin = false
      const destination = '/postcode'

      if ((password) && (password === config.authcookie.sitepassword) && (username === config.authcookie.siteusername)) {
        request.yar.set('isAdmin', true)
        request.cookieAuth.set({ isAdmin: true })
      } else if (password) {
        request.yar.set('isAdmin', '')
        request.cookieAuth.clear()
      } else (
        console.log('Failed to login')
      )
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
