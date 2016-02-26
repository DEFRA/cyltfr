var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/floodrisk/{x}/{y}/{radius}',
  config: {
    description: 'Get the long term flood risk associated with a point. Surface water risk is calculated based on a radius (metres) buffered point in polygon search.',
    handler: require('../controllers/risk'),
    validate: {
      params: {
        x: Joi.number().required(),
        y: Joi.number().required(),
        radius: Joi.number().required()
      }
    }
  }
}
