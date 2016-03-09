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
      var address = request.query.address
      reply.view('map', new MapsViewModel(maps, easting, northing, address))
    },
    validate: {
      query: {
        easting: Joi.number(),
        northing: Joi.number(),
        map: Joi.string(),
        address: Joi.objectId().required()
      }
    }
  }
}
