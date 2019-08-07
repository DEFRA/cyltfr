const util = require('../util')
const config = require('../config').service
const protocol = config.protocol
const host = config.host
const port = config.port
const url = protocol + '://' + host + ':' + port
const floodRiskUrl = url + '/floodrisk/'

function getByCoordinates (x, y, radius) {
  const uri = floodRiskUrl + x + '/' + y + '/' + radius

  return util.getJson(uri)
}

module.exports = {
  getByCoordinates: getByCoordinates
}
