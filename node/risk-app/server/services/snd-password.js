const redis = require('redis')
const config = require('../config')
const randomstring = require('randomstring')
const client = redis.createClient({
  socket: {
    host: config.redisCacheHost,
    port: config.redisCachePort
  }
})

const sndPassword = {
  server: {},
  validate: async (request, session) => {
    try {
      await client.connect()
    } catch (error) {
    }
    const pwConfigPassword = await client.get('pwConfigPassword')
    if (session.isAdmin) {
      return { isValid: true }
    }
    if (pwConfigPassword) {
      if (pwConfigPassword === session.Password) {
        return { isValid: true }
      }
    }
    return { isValid: false }
  },
  authenticate: async (request, session) => {

  },
  randomHexString: async () => {
    return randomstring.generate({
      length: 20,
      readable: true,
      charset: 'hex'
    })
  },
  setNewPassword: async (newPassword, linkurl, redirecturl) => {
    try {
      await client.connect()
    } catch (error) {
    }
    await client.set('pwConfigPassword', newPassword)
    await client.set('pwconfigLinkUrl', linkurl)
    await client.set('pwConfigRedirectUrl', redirecturl)
  },
  PasswordValues: async () => {
    try {
      await client.connect()
    } catch (error) {
    }
    const retval = {}
    retval.pwConfigPassword = client.get('pwConfigPassword')
    retval.pwconfigLinkUrl = client.get('pwconfigLinkUrl')
    retval.pwConfigRedirectUrl = client.get('pwConfigRedirectUrl')
    return retval
  }
}

module.exports = sndPassword
