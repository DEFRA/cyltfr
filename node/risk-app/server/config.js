const joi = require('@hapi/joi')
const config = require('../config/server.json')

const serverSchema = joi.object().required().keys({
  protocol: joi.string().required().allow(['http', 'https']),
  host: joi.string().hostname().required(),
  port: joi.number().required()
})

const serviceSchema = joi.object().required().keys({
  protocol: joi.string().required().allow(['http', 'https']),
  host: joi.string().hostname().required(),
  port: joi.number().required()
})

const ordnanceSurveySchema = joi.object().required().keys({
  key: joi.string().required(),
  urlUprn: joi.string().uri().required(),
  urlPostcode: joi.string().uri().required(),
  urlGetCapabilities: joi.string().uri().required(),
  urlNames: joi.string().uri().required()
})

const errbitSchema = joi.object().required().keys({
  postErrors: joi.boolean().required(),
  env: joi.string().required(),
  key: joi.string().required(),
  host: joi.string().required(),
  proxy: joi.string().allow('')
})

// Define config schema
const schema = {
  server: serverSchema,
  geoserver: serviceSchema,
  service: serviceSchema,
  logging: joi.object(),
  cacheViews: joi.boolean().required(),
  mockAddressService: joi.boolean().required(),
  httpTimeoutMs: joi.number().required().min(0).max(30000),
  mountPath: joi.string().required().allow(''),
  analyticsAccount: joi.string().required().allow(''),
  fbAppId: joi.string().required().allow(''),
  floodWarningsUrl: joi.string().uri().required(),
  floodRiskUrl: joi.string().uri().required(),
  ordnanceSurvey: ordnanceSurveySchema,
  errbit: errbitSchema,
  env: joi.string().valid('development', 'test', 'production').default('development')
}

config.env = process.env.NODE_ENV

// Validate config
const result = joi.validate(config, schema, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value
value.http_proxy = process.env.http_proxy

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
