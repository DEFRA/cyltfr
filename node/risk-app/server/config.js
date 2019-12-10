const joi = require('@hapi/joi')
const config = require('../config/server.json')

// Define config schema
const schema = joi.object().keys({
  host: joi.string().hostname().required(),
  port: joi.number().required(),
  geoserverUrl: joi.string().uri().required(),
  serviceUrl: joi.string().uri().required(),
  mockAddressService: joi.boolean().required(),
  httpTimeoutMs: joi.number().required().min(0).max(30000),
  mountPath: joi.string().required().allow(''),
  analyticsAccount: joi.string().required().allow(''),
  fbAppId: joi.string().required().allow(''),
  floodWarningsUrl: joi.string().uri().required(),
  floodRiskUrl: joi.string().uri().required(),
  osUprnUrl: joi.string().uri().required(),
  osPostcodeUrl: joi.string().uri().required(),
  osGetCapabilitiesUrl: joi.string().uri().required(),
  osNamesUrl: joi.string().uri().required(),
  http_proxy: joi.string(),
  rateLimitEnabled: joi.boolean().default(false),
  rateLimitRequests: joi.number().integer().when('rateLimitEnabled', { is: true, then: joi.required() }),
  rateLimitExpiresIn: joi.number().integer().when('rateLimitEnabled', { is: true, then: joi.required() }),
  rateLimitWhitelist: joi.array().items(joi.string().required()).default([]),
  redisCacheEnabled: joi.boolean().default(false),
  redisCacheHost: joi.string().hostname().when('redisCacheEnabled', { is: true, then: joi.required() }),
  redisCachePort: joi.number().integer().when('redisCacheEnabled', { is: true, then: joi.required() }),
  env: joi.string().valid('development', 'test', 'production').default('development')
})

config.env = process.env.NODE_ENV
config.http_proxy = process.env.http_proxy

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
