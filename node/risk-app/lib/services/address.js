var wreck = require('wreck')
var config = require('../../config').gazetteer
var url = config.protocol + '://' + config.host
var key = 'key=' + require('../../config').gazetteerKey
var findByIdUrl = url + '/places/v1/addresses/uprn?lr=EN&fq=logical_status_code%3A1&dataset=DPA&uprn='
var findByPostcodeUrl = url + '/places/v1/addresses/postcode?lr=EN&fq=logical_status_code%3A1&dataset=DPA&postcode='

function findById (id, callback) {
  var uri = findByIdUrl + id + '&' + key
  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err || res.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }
    callback(null, payload.results)
  })
}

function findByPostcode (postcode, callback) {
  var validPostcode = postcode.toUpperCase().replace(' ', '')
  var uri = findByPostcodeUrl + validPostcode + '&' + key
  wreck.get(uri, { json: true }, function (err, res, payload) {
    if (err || res.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }
    callback(null, payload.results)
  })
}

module.exports = {
  findById: findById,
  findByPostcode: findByPostcode
}
