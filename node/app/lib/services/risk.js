var wreck = require('wreck')
var config = require('config').floodRiskService
var url = config.protocol + '://' + config.host + ':' + config.port
var floodRiskURL = url + '/floodrisk/'

function getByCoordinates (x, y, radius, callback) {
  var uri = floodRiskURL + parseInt(x) + '/' + parseInt(y) + '/' + radius

  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err) {
      return callback(err)
    }

    return callback(null, payload)
  })
}

module.exports = {
  getByCoordinates: getByCoordinates
}
