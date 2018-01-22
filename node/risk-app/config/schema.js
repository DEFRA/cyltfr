const Joi = require('joi')

const serverSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

const serviceSchema = Joi.object().required().keys({
  protocol: Joi.string().required().allow(['http', 'https']),
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

const ordnanceSurveySchema = Joi.object().required().keys({
  key: Joi.string().required(),
  urlUprn: Joi.string().uri().required(),
  urlPostcode: Joi.string().uri().required(),
  urlGetCapabilities: Joi.string().uri().required(),
  urlNames: Joi.string().uri().required()
})

const errbitSchema = Joi.object().required().keys({
  postErrors: Joi.boolean().required(),
  env: Joi.string().required(),
  key: Joi.string().required(),
  host: Joi.string().required(),
  proxy: Joi.string().allow('')
})

module.exports = {
  server: serverSchema,
  geoserver: serviceSchema,
  service: serviceSchema,
  logging: Joi.object(),
  cacheViews: Joi.boolean().required(),
  mockAddressService: Joi.boolean().required(),
  httpTimeoutMs: Joi.number().required().min(0).max(30000),
  mountPath: Joi.string().required().allow(''),
  analyticsAccount: Joi.string().required().allow(''),
  fbAppId: Joi.string().required().allow(''),
  floodWarningsUrl: Joi.string().uri().required(),
  floodRiskUrl: Joi.string().uri().required(),
  ordnanceSurvey: ordnanceSurveySchema,
  errbit: errbitSchema
}
