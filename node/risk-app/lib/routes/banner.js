var Joi = require('joi')
var Boom = require('boom')
var floodService = require('../services/flood')
var BannerViewModel = require('../models/banner-view')
var error = require('../models/errors.json').warningsBanner

module.exports = {
  method: 'GET',
  path: '/banner',
  config: {
    description: 'Get banner by postcode',
    handler: function (request, reply) {
      var postcode = request.query.postcode
      floodService.findWarnings(postcode, function (err, warnings) {
        if (err) {
          return reply()
        }

        var model = new BannerViewModel(postcode, warnings)
        reply.view('partials/common/banner', model, {
          layout: false
        })
      })
    },
    app: {
      useErrorPages: false
    },
    validate: {
      query: {
        postcode: Joi.string().required()
      }
    }
  }
}
