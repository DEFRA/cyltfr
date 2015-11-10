var Boom = require('boom')

module.exports = function addressByPostcode (request, reply) {
  var db = request.server.plugins['hapi-mongodb'].db

  db.collection('address').find({'POSTCODE': request.params.postcode.toUpperCase()}).toArray(function (err, docs) {
    if (err) {
      request.log('error', err)
      return reply(Boom.badRequest())
    }
    reply(docs)
  })
}
