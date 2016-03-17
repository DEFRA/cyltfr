var util = require('../util')
var config = require('../../config').service
var protocol = config.protocol
var host = config.host
var port = config.port
var url = protocol + '://' + host + ':' + port
var floodRiskUrl = url + '/floodrisk/'

function getByCoordinates (x, y, radius, callback) {
  var uri = floodRiskUrl + x + '/' + y + '/' + radius

  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }

    return callback(null, payload)
  })
}

module.exports = {
  getByCoordinates: getByCoordinates
}
