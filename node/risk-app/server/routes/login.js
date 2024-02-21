const joi = require('joi')
const config = require('../config')
const sndPassword = require('../services/snd-password')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    handler: async (request, h) => {
      let PasswordValues = {}
      if (request.yar.get('isAdmin') === true) {
        PasswordValues = await sndPassword.PasswordValues()
      }
      const defaultdestination = {
        label: {
          text: 'Enter the redirect destination'
        },
        id: 'url',
        value: config.authcookie.defaultdestination,
        name: 'url',
        classes: 'govuk-input--width-20'
      }
      return h.view('login', {
        isAdmin: request.yar.get('isAdmin'),
        linkurl: PasswordValues.pwConfigLinkUrl ? PasswordValues.pwConfigLinkUrl : '',
        defaultdestination,
        destinationurl: PasswordValues.pwConfigRedirectUrl ? PasswordValues.pwConfigRedirectUrl : ''
      })
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
    path: '/login',
    handler: async (request, h) => {
      const { password, generate, url } = request.payload
      let isAdmin = false
      const destination = '/login'
      if ((password) && (password === config.authcookie.sitepassword)) {
        isAdmin = true
        request.yar.set('isAdmin', true)
        request.cookieAuth.set({ isAdmin: true })
      } else if (password) {
        request.yar.set('isAdmin', '')
        request.cookieAuth.clear()
      }
      if (request.yar.get('isAdmin')) { isAdmin = true }
      if (isAdmin) {
        if (generate) {
          const randompass = await sndPassword.randomHexString()
          const linkurl = 'http' + (config.authcookie.secure ? 's' : '') + '://' + request.info.host + '/postcode?password=' + randompass
          sndPassword.setNewPassword(randompass, linkurl, url)
        }
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
