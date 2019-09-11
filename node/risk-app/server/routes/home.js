const Joi = require('@hapi/joi')
const HomeViewModel = require('../models/home-view')
const helpers = require('../helpers')
const errorMessages = {
  notfound: 'We can\'t find this address'
}

module.exports = [{
  method: 'GET',
  path: '/',
  options: {
    description: 'Get homepage',
    handler: (request, h) => {
      const query = request.query
      const postcode = query.postcode
      const errors = query.err && [{
        path: 'address',
        type: query.err,
        message: errorMessages[query.err]
      }]

      return h.view('home', new HomeViewModel(postcode, errors))
    }
  }
}, {
  method: 'POST',
  path: '/',
  options: {
    description: 'Post homepage',
    handler: (request, h) => {
      const payload = request.payload
      const postcode = encodeURIComponent(payload.postcode)

      return h.redirect(`/search?postcode=${postcode}`)
    },
    validate: {
      payload: {
        err: Joi.string().allow('notfound'),
        postcode: Joi.string().trim().required().regex(helpers.postcodeRegex)
      },
      failAction: (request, h, error) => {
        // Get the errors and prepare the model
        const errors = error.details
        const payload = request.payload || {}
        const postcode = payload.postcode
        const model = new HomeViewModel(postcode, errors)

        // Respond with the view with errors
        return h.view('home', model).takeover()
      }
    }
  }
}]
