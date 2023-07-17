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
    tokenpostcode: undefined,
    tokenset: undefined,
    tokenvalid: false
  })
}

function storeResults (results, yar) {
  yar.set({
    token: results.token,
    tokenpostcode: results.tokenpostcode,
    tokenset: results.tokenset,
    tokenvalid: results.tokenvalid
  })
}

function tokenExpired (yar) {
  const lastTokenSet = yar.get('tokenset')
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
    tokenpostcode: postcode,
    tokenset: Date.now(),
    tokenvalid: false,
    errormessage: ''
  }
  if (!friendlyCaptchaEnabled) {
    results.tokenvalid = true
    return results
  }

  if (yar.get('captchabypass')) {
    results.tokenvalid = true
    storeResults(results, yar)
    return results
  }

  if (token && (token === 'undefined' || token === '.FETCHING' ||
  token === '.UNSTARTED' || token === '.UNFINISHED')) {
    clearStoredValues(yar)
    results.errormessage = 'You cannot continue until Friendly Captcha' +
      ' has checked that you\'re not a robot'
    return results
  }

  const storedtoken = yar.get('token')

  if (((token) && (token === storedtoken)) || (storedtoken)) {
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
  }

  if (token) {
    // call out and check token
    clearStoredValues(yar)
    if (await validateCaptcha(token, server)) {
      results.tokenvalid = true
    } else {
      results.errormessage = errors.sessionTimeoutError
    }
  } else {
    results.errormessage = errors.sessionTimeoutError
    clearStoredValues(yar)
    return results
  }
  storeResults(results, yar)
  return results
}

module.exports = {
  captchaCheck
}
