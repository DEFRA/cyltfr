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

var ordnanceSurveySchema = Joi.object().required().keys({
  key: Joi.string().required(),
  urlUprn: Joi.string().uri().required(),
  urlPostcode: Joi.string().uri().required(),
  urlGetCapabilities: Joi.string().uri().required()
})

module.exports = {
  server: serverSchema,
  geoserver: serviceSchema,
  service: serviceSchema,
  logging: Joi.object(),
  cacheViews: Joi.boolean().required(),
  mockAddressService: Joi.boolean().required(),
  httpTimeoutMs: Joi.number().required().min(0).max(30000),
  analyticsAccount: Joi.string().required().allow(''),
  floodWarningsUrl: Joi.string().uri().required(),
  ordnanceSurvey: ordnanceSurveySchema
}
