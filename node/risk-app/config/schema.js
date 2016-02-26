var Joi = require('joi')



var serviceSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var serverSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required(),
  load: Joi.object().required()
})

module.exports = {
  server: serverSchema, // sort this out
  geoserver: serviceSchema,
  floodRiskService: serviceSchema,
  gazetteer: serviceSchema,
  logging: Joi.object(),
  pageRefreshTime: Joi.number().required().min(0).max(3600),
  cacheExpiry: Joi.number().required().min(90000).max(9000000),
  analyticsAccount: Joi.string().required().allow('')
}
