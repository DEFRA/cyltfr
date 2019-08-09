const joi = require('@hapi/joi')
const config = require('../config/server.json')

// Define config schema
const serverSchema = joi.object().required().keys({
  host: joi.string().hostname().required(),
  port: joi.number().required()
})

const databaseSchema = joi.object().required().keys({
  connectionString: joi.string().required()
})

const errbitSchema = joi.object().required().keys({
  postErrors: joi.boolean().required(),
  env: joi.string().required(),
  key: joi.string().required(),
  host: joi.string().required(),
  proxy: joi.string().allow('')
})

const schema = {
  server: serverSchema,
  logging: joi.object(),
  database: databaseSchema,
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

// Add some helper props
value.isDev = value.env === 'development'
value.isProd = value.env === 'production'

module.exports = value
