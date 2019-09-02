const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
const util = require('../util')
const locationService = require('../services/location')

module.exports = {
  method: 'GET',
  path: '/api/geocode',
  options: {
    description: 'API geocode',
    handler: async (request, h) => {
      const location = util.cleanseLocation(request.query.location)

      try {
        const result = await locationService.find(location)
        return result || null
      } catch (err) {
        // Send a 500 back - this is handled as a special
        // case with a detailed error message used on the client
        return boom.badImplementation('Geocode error', err)
      }
    },
    app: {
      useErrorPages: false
    },
    validate: {
      query: {
        location: joi.string().required()
      }
    }
  }
}
