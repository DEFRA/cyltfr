const joi = require('joi')
const util = require('../util')
const config = require('../config')
const locationService = require('../services/location')

module.exports = {
  method: 'GET',
  path: '/api/geocode',
  options: {
    description: 'API geocode',
    handler: async (request, h) => {
      try {
        const location = util.cleanseLocation(request.query.location)
        const result = await locationService.find(location)
        return result || null
      } catch (err) {
        // This is handled as a special case with a
        // detailed error message used on the client
        return { error: 'Geocode error' }
      }
    },
    validate: {
      query: joi.object().keys({
        location: joi.string().required()
      }).required()
    },
    plugins: {
      'hapi-rate-limit': {
        enabled: config.rateLimitEnabled
      }
    }
  }
}
