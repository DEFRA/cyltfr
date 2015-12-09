var config = require('config')
var queryConfig = config.get('queries')

var floodRiskService = {
  calculateFloodRisk: function (db, x, y, radius, callback) {
    return db.query(queryConfig.calculateFloodRisk, [x, y, radius], callback)
  }
}

module.exports = floodRiskService
