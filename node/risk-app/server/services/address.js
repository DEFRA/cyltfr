const util = require('../util')
const config = require('../config')
const { osUprnUrl, osPostcodeUrl, osSearchKey } = config

async function findById (id) {
  const uri = `${osUprnUrl}${id}&key=${osSearchKey}`
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
  const uri = `${osPostcodeUrl}${postcode}&key=${osSearchKey}`
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

function capitaliseAddress (address) {
  // Split the address into its components
  const components = address.split(', ')

  // Capitalize the first letter of each word except the last component (postcode)
  for (let i = 0; i < components.length - 1; i++) {
    const words = components[i].split(' ')
    for (let j = 0; j < words.length; j++) {
      words[j] = words[j].charAt(0).toUpperCase() + words[j].slice(1).toLowerCase()
    }
    components[i] = words.join(' ')
  }

  // Join the components back together
  const capitalisedAddress = components.join(', ')

  return capitalisedAddress
}

module.exports = {
  find,
  findById,
  capitaliseAddress
}
