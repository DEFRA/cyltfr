const util = require('../util')
const config = require('../config')
const { osUprnUrl, osPostcodeUrl } = config

async function findById (id) {
  const uri = osUprnUrl + id
  const payload = await util.getJson(uri, true)

  if (!payload || !payload.results || payload.results.length !== 1) {
    throw new Error('Invalid response')
  }

  const result = payload.results[0].DPA
  const address = {
    uprn: result.UPRN,
    nameOrNumber: result.BUILDING_NUMBER || result.BUILDING_NAME || result.ORGANISATION_NAME,
    postcode: result.POSTCODE,
    x: result.X_COORDINATE,
    y: result.Y_COORDINATE,
    address: result.ADDRESS
  }

  return address
}

async function find (postcode) {
  const uri = osPostcodeUrl + postcode
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
        x: item.X_COORDINATE,
        y: item.Y_COORDINATE
      }
    })
}

module.exports = {
  find,
  findById
}
