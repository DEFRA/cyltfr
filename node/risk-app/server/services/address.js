var sprintf = require('sprintf-js')
var util = require('../util')
var custodianCodes = require('../models/custodian-codes')
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

function find (premises, postcode, callback) {
  var uri = sprintf.vsprintf(findByPostcodeUrl, [postcode, config.key])

  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }

    if (!payload || !payload.results || !payload.results.length) {
      return callback(null, [])
    }

    function filterExact (item) {
      return (
        (item.BUILDING_NAME && item.BUILDING_NAME.toLowerCase() === premises.toLowerCase()) ||
        (item.ORGANISATION_NAME && item.ORGANISATION_NAME.toLowerCase() === premises.toLowerCase()) ||
        (item.BUILDING_NUMBER && item.BUILDING_NUMBER === premises)
      )
    }

    function filterLike (item) {
      return (
        (!item.BUILDING_NAME && !item.BUILDING_NUMBER && !item.ORGANISATION_NAME) ||
        (item.BUILDING_NAME && item.BUILDING_NAME.toLowerCase().includes(premises.toLowerCase())) ||
        (item.ORGANISATION_NAME && item.ORGANISATION_NAME.toLowerCase().includes(premises.toLowerCase())) ||
        (item.BUILDING_NUMBER && item.BUILDING_NUMBER === premises)
      )
    }

    var results = payload
      .results
      .map(item => item.DPA)

    // First try to find exact
    // matches on premise name/number.
    var exact = results
      .filter(filterExact)

    // If we have exact matches use them,
    // Otherwise try a more liberal filter.
    var addresses = exact.length
      ? exact
      : addresses = results.filter(filterLike)

    callback(null, addresses
      .map(item => {
        return {
          uprn: item.UPRN,
          postcode: item.POSTCODE,
          address: item.ADDRESS,
          country: custodianCodes[item.LOCAL_CUSTODIAN_CODE]
        }
      }))
  })
}

module.exports = {
  find: find,
  findById: findById
}
