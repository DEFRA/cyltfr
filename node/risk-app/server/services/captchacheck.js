const { sessionTimeout, friendlyCaptchaSecretKey, friendlyCaptchaUrl, friendlyCaptchaEnabled } = require('../config')
const errors = require('../models/errors.json')
const util = require('../util')
const sessionTimeoutInMs = sessionTimeout * 60 * 1000

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
    tokenPostcode: undefined,
    tokenSet: undefined,
    tokenValid: false
  })
}

function storeResults (results, yar) {
  yar.set({
    token: results.token,
    tokenPostcode: results.tokenPostcode,
    tokenSet: results.tokenSet,
    tokenValid: results.tokenValid
  })
}

function tokenExpired (yar) {
  const lastTokenSet = yar.get('tokenSet')
  if (Number.isInteger(lastTokenSet)) {
    if ((sessionTimeoutInMs + lastTokenSet) > Date.now()) {
      return false
    }
  }
  return true
}

async function captchaCheck (token, postcode, yar, server) {
  const results = {
    token,
    tokenPostcode: postcode,
    tokenSet: Date.now(),
    tokenValid: false,
    errorMessage: ''
  }
  if (!friendlyCaptchaEnabled) {
    results.tokenValid = true
    return results
  }

  if (yar.get('captchabypass')) {
    results.tokenValid = true
    storeResults(results, yar)
    return results
  }

  if (token && (token === 'undefined' || token === '.FETCHING' ||
  token === '.UNSTARTED' || token === '.UNFINISHED' || token === '.ERROR')) {
    clearStoredValues(yar)
    results.errorMessage = 'You cannot continue until Friendly Captcha' +
      ' has checked that you\'re not a robot'
    return results
  }

  const storedToken = yar.get('token')

  if ((token && (token === storedToken)) || (storedToken && (!token))) {
    if (postcode === yar.get('tokenPostcode')) {
      if (tokenExpired(yar)) {
        clearStoredValues(yar)
        results.errorMessage = errors.sessionTimeoutError
        return results
      }
      results.tokenValid = yar.get('tokenValid')
      results.tokenSet = yar.get('tokenSet')
      return results
    } else {
      clearStoredValues(yar)
      results.errorMessage = errors.sessionTimeoutError
      return results
    }
  }

  if (token) {
    // call out and check token
    clearStoredValues(yar)
    if (await validateCaptcha(token, server)) {
      results.tokenValid = true
    } else {
      results.errorMessage = errors.sessionTimeoutError
    }
  } else {
    results.errorMessage = errors.sessionTimeoutError
    clearStoredValues(yar)
    return results
  }
  storeResults(results, yar)
  return results
}

module.exports = {
  captchaCheck
}
