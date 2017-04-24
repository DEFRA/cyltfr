var config = require('../../config')
var floodWarningsUrl = config.floodWarningsUrl
// Note wreck won't play with a proxy so need to use request
var request = require('request')


function findWarnings (location, callback) {
  var url = floodWarningsUrl + '/api/warnings?location=' + location
  request(url, function (err, response, body) {
    if (err || response.statusCode !== 200) {
      return callback(err || body || new Error('Unknown error'))
    }
    callback(null, JSON.parse(body))
  })
}

module.exports = {
  findWarnings: findWarnings
}
