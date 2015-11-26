var Joi = require('joi')
var maps = require('../models/maps.json')

module.exports = {
  method: 'GET',
  path: '/map',
  config: {
    description: 'Get the map page',
    handler: function (request, reply) {
      reply.view('map', maps)
    },
    validate: {
      query: {
        easting: Joi.number(),
        northing: Joi.number()
      }
    }
  }
}
