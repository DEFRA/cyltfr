var Joi = require('joi')
var maps = require('../models/maps.json')

module.exports = {
  method: 'GET',
  path: '/map/{easting}/{northing}',
  config: {
    description: 'Get the map page',
    handler: function (request, reply) {
      reply.view('map', maps)
    },
    validate: {
      params: {
        easting: Joi.number().required(),
        northing: Joi.number().required()
      }
    }
  }
}
