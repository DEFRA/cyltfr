var config = require('../../config').gazetteer
var url = config.protocol + '://' + config.host
var key = 'key=' + require('../../config').gazetteerKey
var util = require('../util')
var findByIdUrl = url + '/places/v1/addresses/uprn?lr=EN&fq=logical_status_code%3A1&dataset=DPA&uprn='
var findByPostcodeUrl = url + '/places/v1/addresses/postcode?lr=EN&fq=logical_status_code%3A1&dataset=DPA&postcode='

function findById (id, callback) {
  var uri = findByIdUrl + id + '&' + key
  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }
    var result = payload.results[0]
    var address = ({uprn: result.DPA.UPRN, postcode: result.DPA.POSTCODE, x: result.DPA.X_COORDINATE,
                  y: result.DPA.Y_COORDINATE, address: result.DPA.ADDRESS})
    callback(null, address)
  })
}

function findByPostcode (postcode, callback) {
  var validPostcode = postcode.toUpperCase().replace(' ', '')
  var postcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/gi
  var postcodeMatch = postcode.match(postcodeRegex)
  if (!postcodeMatch) {
    return callback(new Error('postcodeMatchError'))
  }
  var uri = findByPostcodeUrl + validPostcode + '&' + key
  util.getJson(uri, function (err, payload) {
    if (err) {
      return callback(err)
    }
    var addresses = []
    var results = payload.results
    for (var i in results) {
      addresses.push({uprn: results[i].DPA.UPRN, address: results[i].DPA.ADDRESS})
    }
    if (!addresses.length) {
      return callback(new Error('postcodeMatchError'))
    }
    callback(null, addresses)
  })
}

module.exports = {
  findById: findById,
  findByPostcode: findByPostcode
}
