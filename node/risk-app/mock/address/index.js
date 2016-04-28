var addressService = require('../../lib/services/address')
var findById = require('./find-by-id')
var findByPostcode = require('./find-by-postcode')

/**
 * Override the real functions with mock implementations
 */
addressService.findById = function (id, callback) {
  process.nextTick(function () {
    var result = findById[id]
    callback(result ? null : new Error(`findById mock not found for id [${id}]`), result)
  })
}

addressService.findByPostcode = function (postcode, callback) {
  process.nextTick(function () {
    var result = findByPostcode[postcode.toUpperCase()]
    callback(result ? null : new Error(`findByPostcode mock not found for postcode [${postcode}]`), result)
  })
}
