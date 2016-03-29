var Joi = require('joi')
var floodService = require('../services/flood')
var WarningsViewModel = require('../models/warnings-view')

module.exports = {
  method: 'GET',
  path: '/banner',
  config: {
    description: 'Get banner by postcode',
    handler: function (request, reply) {
      var postcode = request.query.postcode
      floodService.findWarnings(postcode, function (err, warnings) {
        if (err) {
          request.log('error', err)
          return reply('Unable to obtain the warnings banner').code(500)
        }

        var model = new WarningsViewModel(postcode, warnings)
        reply.view('partials/common/banner', model, {
          layout: false
        })
      })
    },
    validate: {
      query: {
        postcode: Joi.string().required()
      }
    }
  }
}
