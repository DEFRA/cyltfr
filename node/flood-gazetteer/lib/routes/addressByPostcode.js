var Joi = require('joi')

module.exports = {
  method: 'GET',
  path: '/addressbypostcode/{postcode}',
  config: {
    description: 'Get list of addresses with matching postcode',
    handler: require('../controllers/addressByPostcode'),
    validate: {
      params: {
        postcode: Joi.string().required() // .regex(/^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|(([a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9][abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$/)
      }
    }
  }
}
