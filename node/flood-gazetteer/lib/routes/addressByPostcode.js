var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/addressbypostcode/{postcode}',
  config: {
    description: 'Get list of addresses with matching postcode',
    handler: require('../controllers/addressByPostcode'),
    validate: {
      params: {
        postcode: Joi.string().required()
      }
    }
  }
}
