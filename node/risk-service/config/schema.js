var Joi = require('joi')

var serverSchema = Joi.object().required().keys({
  host: Joi.string().hostname().required(),
  port: Joi.number().required()
})

var databaseSchema = Joi.object().required().keys({
  connectionString: Joi.string().required()
})

var errbitSchema = Joi.object().required().keys({
  postErrors: Joi.boolean().required(),
  env: Joi.string().required(),
  key: Joi.string().required(),
  host: Joi.string().required(),
  proxy: Joi.string().allow('')
})

module.exports = {
  server: serverSchema,
  logging: Joi.object(),
  database: databaseSchema,
  errbit: errbitSchema
}
