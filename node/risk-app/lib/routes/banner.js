var Joi = require('joi')
var Boom = require('boom')
var floodService = require('../services/flood')
var BannerViewModel = require('../models/banner-view')

module.exports = {
  method: 'GET',
  path: '/banner',
  config: {
    description: 'Get banner by postcode',
    handler: function (request, reply) {
      var postcode = request.query.postcode
      floodService.findWarnings(postcode, function (err, warnings) {
        if (err) {
          return reply(Boom.badRequest('Unable to obtain the warnings banner', err))
        }

        var model = new BannerViewModel(postcode, warnings)
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
