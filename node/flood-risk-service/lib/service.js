var config = require('config')
var queryConfig = config.get('queries')

var floodRiskService = {
  calculateFloodRisk: function (db, x, y, radius, callback) {
    x = 528527
    y = 5914677
    return db.query(queryConfig.calculateFloodRisk, [x, y, radius], callback)
  }
}

module.exports = floodRiskService
