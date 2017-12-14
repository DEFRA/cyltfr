const sprintf = require('sprintf-js')
const util = require('../util')
const custodianCodes = require('../models/custodian-codes')
const config = require('../../config').ordnanceSurvey
const findByIdUrl = config.urlUprn
const findByPostcodeUrl = config.urlPostcode

async function findById (id, callback) {
  const uri = sprintf.vsprintf(findByIdUrl, [id, config.key])

  const payload = await util.getJson(uri)

  if (!payload || !payload.results || payload.results.length !== 1) {
    throw new Error('Invalid response')
  }

  const result = payload.results[0].DPA
  const address = {
    uprn: result.UPRN,
    postcode: result.POSTCODE,
    x: result.X_COORDINATE,
    y: result.Y_COORDINATE,
    address: result.ADDRESS
  }

  return address
}

async function find (premises, postcode) {
  const uri = sprintf.vsprintf(findByPostcodeUrl, [postcode, config.key])

  const payload = await util.getJson(uri)

  if (!payload || !payload.results || !payload.results.length) {
    return []
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

  const results = payload
    .results
    .map(item => item.DPA)

  // First try to find exact
  // matches on premise name/number.
  const exact = results
    .filter(filterExact)

  // If we have exact matches use them,
  // Otherwise try a more liberal filter.
  const addresses = exact.length
    ? exact
    : results.filter(filterLike)

  return addresses
    .map(item => {
      return {
        uprn: item.UPRN,
        postcode: item.POSTCODE,
        address: item.ADDRESS,
        country: custodianCodes[item.LOCAL_CUSTODIAN_CODE]
      }
    })
}

module.exports = {
  find: find,
  findById: findById
}
