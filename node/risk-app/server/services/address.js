const sprintf = require('sprintf-js')
const util = require('../util')
const custodianCodes = require('../models/custodian-codes')
const config = require('../../config').ordnanceSurvey
const findByIdUrl = config.urlUprn
const findByPostcodeUrl = config.urlPostcode

async function findById (id) {
  const uri = sprintf.vsprintf(findByIdUrl, [id, config.key])

  const payload = await util.getJson(uri, true)

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

async function find (postcode) {
  const uri = sprintf.vsprintf(findByPostcodeUrl, [postcode, config.key])

  const payload = await util.getJson(uri, true)

  if (!payload || !payload.results || !payload.results.length) {
    return []
  }

  const results = payload.results.map(item => item.DPA)

  return results
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
  find,
  findById
}
