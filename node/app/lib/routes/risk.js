var Joi = require('joi')
var maps = require('../models/maps.json')

module.exports = {
  method: 'GET',
  path: '/risk/{easting}/{northing}',
  config: {
    description: 'Get risk text result',
    handler: function (request, reply) {
      reply.view('risk', maps)
    },
    validate: {
      params: {
        easting: Joi.number().required(),
        northing: Joi.number().required()
      }
    }
  }
}
