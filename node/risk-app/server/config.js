const joi = require('joi')
const config = require('../config/server.json')

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid('dev', 'test', 'prod-green', 'prod-blue'),
  host: joi.string().hostname().required(),
  port: joi.number().required(),
  geoserverUrl: joi.string().uri().required(),
  serviceUrl: joi.string().uri().required(),
  mockAddressService: joi.boolean().required(),
  httpTimeoutMs: joi.number().required().min(0).max(30000),
  analyticsAccount: joi.string().required().allow(''),
  floodWarningsUrl: joi.string().uri().required(),
  floodRiskUrl: joi.string().uri().required(),
  osUprnUrl: joi.string().uri().required(),
  osPostcodeUrl: joi.string().uri().required(),
  osGetCapabilitiesUrl: joi.string().required().allow(''),
  osMapsUrl: joi.string().uri().required(),
  osNamesUrl: joi.string().uri().required(),
  osSearchKey: joi.string().required().allow(''),
  osMapsKey: joi.string().required().allow(''),
  http_proxy: joi.string(),
  rateLimitEnabled: joi.boolean().default(false),
  rateLimitRequests: joi.number().integer().when('rateLimitEnabled', { is: true, then: joi.required() }),
  rateLimitExpiresIn: joi.number().integer().when('rateLimitEnabled', { is: true, then: joi.required() }),
  rateLimitWhitelist: joi.array().items(joi.string().required()).default([]),
  redisCacheEnabled: joi.boolean().default(false),
  redisCacheHost: joi.string().hostname().when('redisCacheEnabled', { is: true, then: joi.required() }),
  redisCachePort: joi.number().integer().when('redisCacheEnabled', { is: true, then: joi.required() }),
  cookiePassword: joi.string().min(32).required(),
  captchaEnabled: joi.boolean().default(false),
  friendlyCaptchaEnabled: joi.boolean().default(false),
  captchaUrl: joi.string().uri().when('captchaEnabled', { is: true, then: joi.required() }),
  captchaSiteKey: joi.string().when('captchaEnabled', { is: true, then: joi.required() }),
  captchaSecretKey: joi.string().when('captchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaSiteKey: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaSecretKey: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaUrl: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  sessionTimeout: joi.number().default(10)
})

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
value.isDev = value.env === 'dev'
value.isTest = value.env === 'test'
value.isProd = value.env.startsWith('prod-')

console.log('Server config', value)
console.log('Version', process.versions)
<<<<<<< HEAD

=======
>>>>>>> faa7f854fd7a8bf392b41d6bf15957747645d55b

module.exports = value
