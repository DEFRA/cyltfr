const Fuse = require('fuse.js')
const sprintf = require('sprintf-js')
const util = require('../util')
const custodianCodes = require('../models/custodian-codes')
const config = require('../../config').ordnanceSurvey
const findByIdUrl = config.urlUprn
const findByPostcodeUrl = config.urlPostcode
const fuzzyOptions = {
  shouldSort: true,
  includeScore: true,
  caseSensitive: false,
  findAllMatches: true,
  threshold: 0.5,
  keys: [
    'BUILDING_NAME',
    'BUILDING_NUMBER',
    'SUB_BUILDING_NAME',
    'ORGANISATION_NAME'
  ]
}

async function findById (id, callback) {
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

async function find (premises, postcode) {
  const uri = sprintf.vsprintf(findByPostcodeUrl, [postcode, config.key])

  const payload = await util.getJson(uri, true)

  if (!payload || !payload.results || !payload.results.length) {
    return []
  }

  const results = payload.results.map(item => item.DPA)
  const fuse = new Fuse(results, fuzzyOptions)
  const res = fuse.search(premises)
  const exact = res.filter(r => !r.score)

  let addresses = (exact.length ? exact : res).map(r => r.item)

  if (!addresses.length) {
    // We found no matches so return the
    // top third of the original results
    addresses = results.slice(0, Math.round(results.length / 3) + 1)
  }

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
