var Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = [
  require('./home'),
  require('./search'),
  require('./risk'),
  require('./map'),
  require('./statics'),
  // require('./404')
  require('./proxy')
]
