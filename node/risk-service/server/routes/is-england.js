const joi = require('@hapi/joi')
const boom = require('@hapi/boom')
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
        return boom.badRequest('Failed to get isEngland', err)
      }
    },
    validate: {
      params: {
        x: joi.number().required(),
        y: joi.number().required()
      }
    }
  }
}
