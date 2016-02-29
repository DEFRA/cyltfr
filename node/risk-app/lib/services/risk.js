var wreck = require('wreck')
var config = require('../../config').service
var url = config.protocol + '://' + config.host + ':' + config.port
var floodRiskURL = url + '/floodrisk/'

function getByCoordinates (x, y, radius, callback) {
  var uri = floodRiskURL + x + '/' + y + '/' + radius

  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err || res.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }

    return callback(null, payload)
  })
}

module.exports = {
  getByCoordinates: getByCoordinates
}
