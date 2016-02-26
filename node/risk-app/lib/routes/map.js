var Joi = require('joi')
var maps = require('../models/maps.json')
var MapsViewModel = require('../models/maps-view')

module.exports = {
  method: 'GET',
  path: '/map',
  config: {
    description: 'Get the map page',
    handler: function (request, reply) {
      var easting = request.query.easting
      var northing = request.query.northing
      reply.view('map', new MapsViewModel(maps, easting, northing))
    },
    validate: {
      query: {
        easting: Joi.number(),
        northing: Joi.number(),
        map: Joi.string()
      }
    }
  }
}
