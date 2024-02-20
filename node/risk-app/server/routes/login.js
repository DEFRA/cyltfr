const joi = require('joi')
const config = require('../config')
const sndPassword = require('../services/snd-password')

module.exports = [
  {
    method: 'GET',
    path: '/login',
    handler: async (request, h) => {
      let PasswordValues = {}
      if (request.cookieAuth.isAdmin) {
        console.log('isAdmin')
        PasswordValues = await sndPassword.PasswordValues()
      }
      return h.view('login', {
        isAdmin: request.cookieAuth.isAdmin,
        linkurl: PasswordValues.pwconfigLinkUrl
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
      let destination = '/postcode'
      if ((password) && (password === config.authcookie.sitepassword)) {
        isAdmin = true
        request.cookieAuth.set({ isAdmin: true })
        destination = '/login'
      } else if (password) {
        request.cookieAuth.clear()
      }
      if (request.cookieAuth.isAdmin) { isAdmin = true }
      if (isAdmin) {
        if (generate) {
          const randompass = await sndPassword.randomHexString()
          const linkurl = 'http' + (config.authcookie.secure ? 's' : '') + '://' + request.info.host + '/postcode?password=' + randompass
          sndPassword.setNewPassword(randompass, linkurl, url)
        }
        destination = '/login'
      }
      return h.redirect(destination)
    },
    options: {
      description: 'Submit Login Page',
      auth: {
        strategy: 'session',
        mode: 'try'
      // },
      // validate: {
      //   payload: joi.object({
      //     password: joi.string().default(''),
      //     generate: joi.boolean().default(false),
      //     url: joi.string().default('')
      //   }),
      //   failAction: async (request, h, err) => {
      //     return h.view('login').takeover()
      //   }
      }
    }
  }
]
