var queries = require('./queries.json')

var floodRiskService = {
  calculateFloodRisk: function (db, x, y, radius, callback) {
    return db.query(queries.calculateFloodRisk, [x, y, radius], callback)
  },
  isEngland: function (db, lng, lat, callback) {
    return db.query(queries.isEngland, [lng, lat], callback)
  }
}

module.exports = floodRiskService
