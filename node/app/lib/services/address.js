var wreck = require('wreck')
var config = require('config').gazetteer
var url = config.protocol + '://' + config.host + ':' + config.port
var findByIdUrl = url + '/address/'
var findByPostcodeUrl = url + '/addressbypostcode/'

function findById (id, callback) {
  var uri = findByIdUrl + id

  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err || res.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }

    callback(null, payload)
  })
}

function findByPostcode (postcode, callback) {
  var uri = findByPostcodeUrl + postcode

  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err || res.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }

    callback(null, payload)
  })
}

module.exports = {
  findById: findById,
  findByPostcode: findByPostcode
}
