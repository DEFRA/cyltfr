var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/postcodes/{partialPostcode}',
  config: {
    description: 'Get list of potential postcodes for partial',
    handler: require('../controllers/postcodes'),
    validate: {
      params: {
        partialPostcode: Joi.string().required()
      }
    }
  }
}
