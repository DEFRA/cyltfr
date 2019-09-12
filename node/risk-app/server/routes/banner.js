const Joi = require('@hapi/joi')
const floodService = require('../services/flood')
const BannerViewModel = require('../models/banner-view')

module.exports = {
  method: 'GET',
  path: '/banner',
  options: {
    description: 'Get banner by postcode',
    handler: async (request, h) => {
      const postcode = request.query.postcode

      try {
        const warnings = await floodService.findWarnings(postcode)
        const model = new BannerViewModel(postcode, warnings)
        return h.view('partials/common/banner', model, {
          layout: false
        })
      } catch (err) {
        return null
      }
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
