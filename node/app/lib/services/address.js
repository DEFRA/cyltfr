var config = require('config').gazetteer
var wreck = require('wreck')

function findById (id, callback) {
  var uri = config.protocol + '://' + config.host + ':' + config.port + config.routes.address.replace('{id}', id)

  wreck.get(uri, {}, function (err, res, payload) {
    if (err) {
      callback(err)
    }

    callback(null, JSON.parse(payload.toString()))
  })
}

function findByPostcode (postcode, callback) {
  var uri = config.protocol + '://' + config.host + ':' + config.port + config.routes.addressByPostcode.replace('{postcode}', postcode)

  wreck.get(uri, {}, function (err, res, payload) {
    if (err) {
      callback(err)
    }

    callback(null, JSON.parse(payload.toString()))
  })
}

module.exports = {
  findById: findById,
  findByPostcode: findByPostcode
}
