const { sessionTimeout, friendlyCaptchaSecretKey, friendlyCaptchaUrl, friendlyCaptchaEnabled } = require('../config')
const errors = require('../models/errors.json')
const util = require('../util')

async function validateCaptcha (token, server) {
  // If we need to verify the token, do this here.
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
  try {
    const apiResponse = await util.post(uri, options, true)
    if (!apiResponse.success) {
      if (server.methods.notify) { server.methods.notify(apiResponse) }
      console.log(apiResponse.errors[0])
      return false
    }
  } catch (error) {
    if (server.methods.notify) { server.methods.notify(error) }
  }
  return true
}

function clearStoredValues (yar) {
  yar.set({
    token: undefined,
    tokenpostcode: undefined,
    tokenset: undefined,
    tokenvalid: false
  })
}

function tokenExpired (yar) {
  const lastTokenSet = yar.get('tokenset')
  if (Number.isInteger(lastTokenSet)) {
    if (((sessionTimeout * 60 * 1000) + lastTokenSet) > Date.now()) {
      return false
    }
  }
  return true
}

async function captchaCheck (token, postcode, yar, server) {
  const results = {
    token,
    tokenpostcode: postcode,
    tokenset: Date.now(),
    tokenvalid: false,
    errormessage: ''
  }
  if (friendlyCaptchaEnabled) {
    if (!yar.get('captchabypass')) {
      const storedtoken = yar.get('token')
      if (token) {
        // we've been passed a token
        if (token === 'undefined' || token === '.FETCHING' ||
            token === '.UNSTARTED' || token === '.UNFINISHED') {
          clearStoredValues(yar)
          results.errormessage = 'You cannot continue until Friendly Captcha' +
          ' has checked that you\'re not a robot'
          return results
        }
        if (token === storedtoken) {
          if (postcode === yar.get('tokenpostcode')) {
            if (tokenExpired(yar)) {
              clearStoredValues(yar)
              results.errormessage = errors.sessionTimeoutError
              return results
            }
            results.tokenvalid = yar.get('tokenvalid')
            results.tokenset = yar.get('tokenset')
            return results
          } else {
            clearStoredValues(yar)
            results.errormessage = errors.sessionTimeoutError
            return results
          }
        } else {
          // call out and check token
          clearStoredValues(yar)
          if (await validateCaptcha(token, server)) {
            results.tokenvalid = true
          } else {
            results.errormessage = errors.sessionTimeoutError
          }
        }
      } else {
        if (storedtoken) {
          if (postcode === yar.get('tokenpostcode')) {
            if (tokenExpired(yar)) {
              clearStoredValues(yar)
              results.errormessage = errors.sessionTimeoutError
              return results
            }
            results.tokenvalid = yar.get('tokenvalid')
            results.tokenset = yar.get('tokenvalid')
            return results
          }
        }
        results.errormessage = errors.sessionTimeoutError
        clearStoredValues(yar)
        return results
      }
      // check if passed token is valid
      // we need to revalidate if
      // passed token contains a value, and token and storedtoken are different
      // passed token = storedtoken, but postcode is different
      // passed token doesn't contain a value, but postcode is different
      // passed token doesn't contain a value, but time has expired
    } else {
      results.tokenvalid = true
    }
    yar.set({
      token: results.token,
      tokenpostcode: results.tokenpostcode,
      tokenset: results.tokenset,
      tokenvalid: results.tokenvalid
    })
  } else {
    results.tokenvalid = true
  }
  return results
}

module.exports = {
  captchaCheck
}
