const addressService = require('../../server/services/address')
const findById = require('./find-by-id')
const findByPostcode = require('./find')

/**
 * Override the real functions with mock implementations
 */
addressService.findById = function (id) {
  const result = findById[id]
  return result
    ? Promise.resolve(result)
    : Promise.reject(new Error(`findById mock not found for id [${id}]`))
}

addressService.find = function (postcode) {
  const result = findByPostcode[postcode.toUpperCase()]
  return result
    ? Promise.resolve(result)
    : Promise.reject(new Error(`findByPostcode mock not found for postcode [${postcode}]`))
}
