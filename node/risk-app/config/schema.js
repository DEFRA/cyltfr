var Joi = require('joi')

var serverSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var serviceSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

module.exports = {
  server: serverSchema,
  geoserver: serviceSchema,
  service: serviceSchema,
  gazetteer: serviceSchema,
  logging: Joi.object(),
  cacheViews: Joi.boolean().required(),
  pageRefreshTime: Joi.number().required().min(0).max(3600),
  analyticsAccount: Joi.string().required().allow(''),
  floodWarningsUrl: Joi.string().uri().required(),
  gazetteerKey: Joi.string().required()
}
