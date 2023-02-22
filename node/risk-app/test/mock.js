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

const mockOptions = (postcode) => {
  let options
  const token = 'sample token value'
  if (config.friendlyCaptchaEnabled) {
    options = {
      method: 'GET',
      url: `/search?postcode=${encodeURIComponent(postcode)}&token=${encodeURIComponent(token)}`
    }
  } else {
    options = {
      method: 'GET',
      url: `/search?postcode=${encodeURIComponent(postcode)}`
    }
  }
  return options
}

const mockCaptchaResponse = (responseType, errorType) => {
  if (responseType === false && errorType === 'solution timeout') { return { success: false, errors: ['solution_timeout_or_duplicate'] } } else if (responseType === false && errorType === 'invalid solution') { return { success: false, errors: ['solution_invalid'] } } else { return { success: true } }
}
module.exports = { mock, mockOptions, mockCaptchaResponse }
