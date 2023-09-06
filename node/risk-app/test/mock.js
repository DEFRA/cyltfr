const config = require('../server/config')
const mock = {
  replace: function replace (obj, name, fn) {
    // Store the original function
    const original = obj[name]

    // Override the function
    obj[name] = fn

    // Return a handy cleanup function
    return {
      revert: function () {
        obj[name] = original
      }
    }
  },
  makePromise: function makePromise (...args) {
    return function () {
      return args[0] ? Promise.reject(args[0]) : Promise.resolve(args[1])
    }
  }
}

const mockOptions = () => {
  let options
  if (config.friendlyCaptchaEnabled && config.friendlyCaptchaBypass) {
    options = {
      method: 'GET',
      url: `/postcode?captchabypass=${encodeURIComponent(config.friendlyCaptchaBypass)}`
    }
  } else {
    options = {
      method: 'GET',
      url: '/postcode'
    }
  }
  return options
}

const mockSearchOptions = (postcode, cookie) => {
  const postPostcode = postcode.replace(' ', '+')
  const postOptions = {
    method: 'POST',
    url: '/postcode',
    payload: `postcode=${postPostcode}`,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }
  const getOptions = {
    method: 'GET',
    url: `/search?postcode=${encodeURIComponent(postcode)}`
  }
  if (cookie) {
    postOptions.headers.cookie = cookie
    getOptions.headers = {
      cookie
    }
  }
  return { postOptions, getOptions }
}

const mockCaptchaCheck = (postcode) => {
  return {
    token: '',
    tokenPostcode: postcode,
    tokenSet: Date.now(),
    tokenValid: true,
    errorMessage: ''
  }
}

const createMockYar = () => {
  class YarMock {
    constructor () {
      this._store = { }
    }

    get (key) {
      return this._store[key]
    }

    set (key, value) {
      this._store[key] = value
    }
  }

  const yar = new YarMock()

  return yar
}

const mockCaptchaResponse = (responseType, errorType) => {
  if (responseType === false && errorType === 'solution timeout') {
    return { success: false, errors: ['solution_timeout_or_duplicate'] }
  } else if (responseType === false && errorType === 'invalid solution') {
    return { success: false, errors: ['solution_invalid'] }
  } else { return { success: true } }
}
module.exports = { mock, mockOptions, mockSearchOptions, mockCaptchaResponse, createMockYar, mockCaptchaCheck }
