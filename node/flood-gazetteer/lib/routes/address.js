var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/address/{id}',
  config: {
    description: 'Get address by ID',
    handler: require('../controllers/address'),
    validate: {
      params: {
        id: Joi.string().required()
      }
    }
  }
}
