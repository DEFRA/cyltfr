var Joi = require('joi')
var HomeViewModel = require('../models/home-view')
var helpers = require('../helpers')
var errorMessages = {
  notfound: 'We can\'t find this address'
}

module.exports = [{
  method: 'GET',
  path: '/',
  config: {
    description: 'Get homepage',
    handler: function (request, reply) {
      var query = request.query
      var premises = query.premises
      var postcode = query.postcode
      var errors = query.err && [{
        path: 'address',
        type: query.err,
        message: errorMessages[query.err]
      }]

      reply.view('home', new HomeViewModel(premises, postcode, errors))
    }
  }
}, {
  method: 'POST',
  path: '/',
  config: {
    description: 'Post homepage',
    handler: function (request, reply) {
      var payload = request.payload
      var premises = encodeURIComponent(payload.premises)
      var postcode = encodeURIComponent(payload.postcode)

      return reply.redirect(`/search?premises=${premises}&postcode=${postcode}`)
    },
    validate: {
      payload: {
        err: Joi.string().allow('notfound'),
        premises: Joi.string().trim().required().max(100),
        postcode: Joi.string().trim().required().regex(helpers.postcodeRegex)
      },
      failAction: function (request, reply, source, error) {
        // Get the errors and prepare the model
        var errors = error.data.details
        var payload = request.payload || {}
        var premises = payload.premises
        var postcode = payload.postcode
        var model = new HomeViewModel(premises, postcode, errors)

        // Respond with the view with errors
        return reply.view('home', model)
      }
    }
  }
}]
