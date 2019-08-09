const Joi = require('joi')
const Boom = require('boom')
const service = require('../services')

module.exports = {
  method: 'GET',
  path: '/is-england/{x}/{y}',
  options: {
    description: 'Check if coordinates are in england',
    handler: async (request, h) => {
      const params = request.params

      try {
        const result = await service.isEngland(params.x, params.y)
        return result.rows[0]
      } catch (err) {
        return Boom.badRequest('Failed to get isEngland', err)
      }
    },
    validate: {
      params: {
        x: Joi.number().required(),
        y: Joi.number().required()
      }
    }
  }
}
