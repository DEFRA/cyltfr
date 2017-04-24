var queries = require('./queries.json')

var floodRiskService = {
  calculateFloodRisk: function (db, x, y, radius, callback) {
    return db.query(queries.calculateFloodRisk, [x, y, radius], callback)
  }
}

module.exports = floodRiskService
