const joi = require('joi')

function readConfigFile () {
  const fileValues = require('../config/server.json')
  Object.keys(fileValues).forEach(function (key) {
    config[key] = fileValues[key]
  })
}

// Define config schema
const schema = joi.object().keys({
  env: joi.string().valid('dev', 'test', 'prod-green', 'prod-blue'),
  host: joi.string().hostname().required(),
  port: joi.number().required(),
  geoserverUrl: joi.string().uri().required(),
  serviceUrl: joi.string().uri().required(),
  simulateAddressService: joi.boolean().default(false),
  httpTimeoutMs: joi.number().required().min(0).max(30000),
  analyticsAccount: joi.string().default(''),
  G4AnalyticsAccount: joi.string().default(''),
  GTagManagerId: joi.string().default(''),
  floodWarningsUrl: joi.string().uri().required(),
  floodRiskUrl: joi.string().uri().required(),
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
  friendlyCaptchaEnabled: joi.boolean().default(false),
  friendlyCaptchaSiteKey: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaSecretKey: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaUrl: joi.string().when('friendlyCaptchaEnabled', { is: true, then: joi.required() }),
  friendlyCaptchaBypass: joi.string().default(''),
  sessionTimeout: joi.number().default(10),
  riskPageFlag: joi.boolean().default(false),
  cacheEnabled: joi.boolean().default(true),
  errbit: joi.object().required().keys({
    postErrors: joi.boolean().required(),
    options: {
      env: joi.string().required(),
      key: joi.string().required(),
      host: joi.string().required(),
      proxy: joi.string().allow('')
    }
  })
})

const config = {
  env: process.env.env,
  host: process.env.host,
  port: process.env.port,
  geoserverUrl: process.env.geoserverUrl,
  serviceUrl: process.env.serviceUrl,
  simulateAddressService: process.env.simulateAddressService,
  httpTimeoutMs: process.env.httpTimeoutMs,
  G4AnalyticsAccount: process.env.G4AnalyticsAccount,
  GTagManagerId: process.env.GTagManagerId,
  floodWarningsUrl: process.env.floodWarningsUrl,
  floodRiskUrl: process.env.floodRiskUrl,
  osPostcodeUrl: process.env.osPostcodeUrl,
  osGetCapabilitiesUrl: process.env.osGetCapabilitiesUrl,
  osMapsUrl: process.env.osMapsUrl,
  osNamesUrl: process.env.osNamesUrl,
  osSearchKey: process.env.osSearchKey,
  osMapsKey: process.env.osMapsKey,
  http_proxy: process.env.http_proxy,
  rateLimitEnabled: process.env.rateLimitEnabled,
  rateLimitRequests: process.env.rateLimitRequests,
  rateLimitExpiresIn: process.env.rateLimitExpiresIn,
  rateLimitWhitelist: process.env.rateLimitWhitelist,
  redisCacheEnabled: process.env.redisCacheEnabled,
  redisCacheHost: process.env.redisCacheHost,
  redisCachePort: process.env.redisCachePort,
  cookiePassword: process.env.cookiePassword,
  friendlyCaptchaEnabled: process.env.friendlyCaptchaEnabled,
  friendlyCaptchaSiteKey: process.env.friendlyCaptchaSiteKey,
  friendlyCaptchaSecretKey: process.env.friendlyCaptchaSecretKey,
  friendlyCaptchaUrl: process.env.friendlyCaptchaUrl,
  friendlyCaptchaBypass: process.env.friendlyCaptchaBypass,
  sessionTimeout: process.env.sessionTimeout,
  riskPageFlag: process.env.riskPageFlag,
  cacheEnabled: process.env.cacheEnabled,
  errbit: {
    postErrors: process.env.errbitpostErrors,
    options: {
      env: process.env.errbitenv,
      key: process.env.errbitkey,
      host: process.env.errbithost,
      proxy: process.env.errbitproxy
    }
  }
}

config.rateLimitWhitelist = config.rateLimitWhitelist ? config.rateLimitWhitelist.split(',') : []

// Validate config
let result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  // read from config file
  readConfigFile()
  result = schema.validate(config, {
    abortEarly: false
  })
}

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

module.exports = value
