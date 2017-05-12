var sprintf = require('sprintf-js')
var util = require('../util')
var config = require('../../config')
var urlNamesApi = config.ordnanceSurvey.urlNames
var isEngland = require('./is-england')

module.exports = {
  find: function findByPlace (place, callback) {
    var uri = sprintf.vsprintf(urlNamesApi, [place])
    util.getJson(uri, function (err, payload) {
      if (err) {
        return callback(err)
      }

      if (!payload || !payload.results || !payload.results.length) {
        return callback(null, [])
      }

      var results = payload.results
      // only interested in x and y at the moment
      var gazetteerEntry = results.map(function (item) {
        return {
          easting: item.GAZETTEER_ENTRY.GEOMETRY_X,
          northing: item.GAZETTEER_ENTRY.GEOMETRY_Y
        }
      })[0]

      isEngland.getIsEngland(gazetteerEntry.easting, gazetteerEntry.northing, function (err, result) {
        if (err) {
          return callback(err)
        }
        gazetteerEntry.isEngland = result.is_england
        callback(null, gazetteerEntry)
      })
    })
  }
}
