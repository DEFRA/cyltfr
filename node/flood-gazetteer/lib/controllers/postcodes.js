var Boom = require('boom')
var Postcode = require('../models/postcode')

module.exports = function postcodes (request, reply) {
  var db = request.server.plugins['hapi-mongodb'].db
  var regexp = new RegExp('^' + request.params.partialPostcode.toUpperCase().replace(' ', ''))

  db.collection('postcode')
    .find({ 'PC_NOSPACE': regexp }).toArray(function (err, docs) {
      if (err) {
        request.log('error', err)
        return reply(Boom.badRequest())
      }

      reply(docs.map(function (doc) {
        return new Postcode(doc)
      }))
    })
}
