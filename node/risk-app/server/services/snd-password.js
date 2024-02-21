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
  authenticate: async (password) => {
    const pwValues = await sndPassword.PasswordValues()
    if (pwValues.pwConfigPassword === password) {
      return {
        isValid: true,
        pwConfigRedirectUrl: pwValues.pwConfigRedirectUrl
      }
    } else {
      return { isValid: false }
    }
  },
  randomHexString: async () => {
    return randomstring.generate({
      length: 20,
      readable: true,
      charset: 'hex'
    })
  },
  setVal: async (key, value) => {
    if (value) {
      return client.set(key, value)
    } else {
      return client.set(key, '')
    }
  },
  setNewPassword: async (newPassword, linkurl, redirecturl) => {
    try {
      await client.connect()
    } catch (error) {
    }
    await Promise.all([sndPassword.setVal('pwConfigPassword', newPassword),
      sndPassword.setVal('pwConfigLinkUrl', linkurl),
      sndPassword.setVal('pwConfigRedirectUrl', redirecturl)])
  },
  PasswordValues: async () => {
    try {
      await client.connect()
    } catch (error) {
    }
    const retval = {};
    [retval.pwConfigPassword, retval.pwConfigLinkUrl, retval.pwConfigRedirectUrl] = await Promise.all([
      client.get('pwConfigPassword'),
      client.get('pwConfigLinkUrl'),
      client.get('pwConfigRedirectUrl')])
    return retval
  }
}

module.exports = sndPassword
