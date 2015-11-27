var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/floodrisk/{x}/{y}/{radius}',
  config: {
    description: 'Get the long term flood risk associated with a point.  Surface water risk is calculated based on a radial (metres) buffered point in polygon search.',
    handler: require('../controllers/floodRiskController'),
    validate: {
      params: {
        format: Joi.string().valid('xml', 'json'),
        x: Joi.number().required(),
        y: Joi.number().required(),
        radius: Joi.number().required()
      }
    }
  }
}
