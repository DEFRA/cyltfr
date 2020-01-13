const util = require('../util')
const config = require('../config')
const osNamesUrl = config.osNamesUrl
const isEngland = require('./is-england')

module.exports = {
  find: async function findByPlace (place) {
    const uri = osNamesUrl + place

    const payload = await util.getJson(uri, true)

    if (!payload || !payload.results || !payload.results.length) {
      return []
    }

    const results = payload.results

    // only interested in x and y at the moment
    const gazetteerEntry = results.map(function (item) {
      return {
        easting: item.GAZETTEER_ENTRY.GEOMETRY_X,
        northing: item.GAZETTEER_ENTRY.GEOMETRY_Y
      }
    })[0]

    const result = await isEngland.getIsEngland(gazetteerEntry.easting, gazetteerEntry.northing)

    gazetteerEntry.isEngland = result.is_england

    return gazetteerEntry
  }
}
