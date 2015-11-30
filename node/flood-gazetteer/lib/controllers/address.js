var Boom = require('boom')
var Address = require('../models/address')

module.exports = function address (request, reply) {
  var db = request.server.plugins['hapi-mongodb'].db
  var id = request.server.plugins['hapi-mongodb'].ObjectID(request.params.id)

  db.collection('address').findOne({ _id: id }, function (err, doc) {
    if (err) {
      request.log('error', err)
      return reply(Boom.badRequest())
    }

    reply(new Address(doc))
  })
}
