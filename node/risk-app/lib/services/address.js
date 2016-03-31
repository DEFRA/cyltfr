var sprintf = require('sprintf-js')
var util = require('../util')
var config = require('../../config').ordnanceSurvey
var findByIdUrl = config.urlUprn
var findByPostcodeUrl = config.urlPostcode

function findById (id, callback) {
  var uri = sprintf.vsprintf(findByIdUrl, [id, config.key])

  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }

    if (!payload || !payload.results || payload.results.length !== 1) {
      return callback(new Error('Invalid response'))
    }

    var result = payload.results[0].DPA
    var address = {
      uprn: result.UPRN,
      postcode: result.POSTCODE,
      x: result.X_COORDINATE,
      y: result.Y_COORDINATE,
      address: result.ADDRESS
    }

    callback(null, address)
  })
}

function findByPostcode (postcode, callback) {
  var uri = sprintf.vsprintf(findByPostcodeUrl, [postcode, config.key])

  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }

    if (!payload || !payload.results) {
      return callback(null, [])
    }

    var results = payload.results
    var addresses = results.map(function (item) {
      return {
        uprn: item.DPA.UPRN,
        address: item.DPA.ADDRESS
      }
    })

    if (!addresses.length) {
      return callback(new Error('Postcode match error'))
    }

    callback(null, addresses)
  })
}

module.exports = {
  findById: findById,
  findByPostcode: findByPostcode
}
