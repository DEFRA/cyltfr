const joi = require('joi')
const boom = require('@hapi/boom')
const service = require('../services')

module.exports = {
  method: 'GET',
  path: '/extra_info/{x}/{y}',
  options: {
    description: 'Get the extra info associated with a point',
    handler: async (request, _h) => {
      const params = request.params

      try {
        const result = await service.getExtraInfo(params.x, params.y)

        return result
      } catch (err) {
        return boom.badRequest('Could not call service', err)
      }
    },
    validate: {
      params: joi.object().keys({
        x: joi.number().required(),
        y: joi.number().required()
      }).required()
    }
  }
}
