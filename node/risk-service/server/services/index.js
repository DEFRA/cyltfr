const queries = require('./queries.json')
const db = require('../db')

const floodRiskService = {
  calculateFloodRisk: function (x, y, radius) {
    return db.query(queries.calculateFloodRisk, [x, y, radius])
  },
  isEngland: function (lng, lat) {
    return db.query(queries.isEngland, [lng, lat])
  }
}

module.exports = floodRiskService
