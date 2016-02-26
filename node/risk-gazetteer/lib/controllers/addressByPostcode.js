var Boom = require('boom')
var Address = require('../models/address')

module.exports = function addressByPostcode (request, reply) {
  var db = request.server.plugins['hapi-mongodb'].db
  var postcode = request.params.postcode.toUpperCase().replace(' ', '')

  db.collection('address')
    .find({
      'PC_NOSPACE': postcode
    })
    .sort({ 'BLDGNUMBER': 1 })
    .toArray(function (err, docs) {
      if (err) {
        request.log('error', err)
        return reply(Boom.badRequest())
      }

      reply(docs.map(function (doc) {
        return new Address(doc)
      }))
    })
}
