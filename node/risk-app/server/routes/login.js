const joi = require('joi')
const config = require('../config')
const sndPassword = require('../services/snd-password')
const { plugin } = require('@hapi/h2o2')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    handler: async (request, h) => {
      let PasswordValues = {}
      let error = false
      let loggedIn = false

      if (request.query.failed === true) {
        error = true
      } else {
        request.query.failed === false
      }

      if (request.query.auth === true) {
        loggedIn = true
      }

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
        destinationurl: PasswordValues.pwConfigRedirectUrl ? PasswordValues.pwConfigRedirectUrl : '',
        error,
        loggedIn
      })
    },
    options: {
      description: 'Get Login Page',
      auth: {
        strategy: 'session',
        mode: 'optional'
      },
      plugins: {
        cookie: {
          redirectTo: false
        }
      },
      validate: {
        query: joi.object({
          failed: joi.boolean().default(false),
          auth: joi.boolean().default(false)
        }).optional()
      }
    }
  },
  {
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
      const { password, generate, url } = request.payload
      let isAdmin = false
      let destination = 'login'

      if ((password) && (password === config.authcookie.sitepassword)) {
        isAdmin = true
        request.yar.set('isAdmin', true)
        request.cookieAuth.set({ isAdmin: true })
        destination = 'login?auth=true'
      } else if (password) {
        request.yar.set('isAdmin', '')
        request.cookieAuth.clear()
        destination = 'login?failed=true'
      } else {
        destination = 'login?failed=true'
      }
      if (request.yar.get('isAdmin')) { isAdmin = true }
      if (isAdmin) {
        if (generate === 'true') {
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
