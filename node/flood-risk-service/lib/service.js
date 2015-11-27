'use strict'

var config = require('config')
var queryConfig = config.get('queries')

function FloodRiskService () {
  // Public functions
  this.calculateFloodRisk = function (db, x, y, radius, callback) {
    return db.query(queryConfig.calculateFloodRisk, [x, y, radius], callback)
  }
}

module.exports = new FloodRiskService()
