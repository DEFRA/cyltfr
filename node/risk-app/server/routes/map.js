const Joi = require('@hapi/joi')
const MapsViewModel = require('../models/maps-view')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    description: 'Get the map page',
    handler: (request, h) => {
      const easting = request.query.easting
      const northing = request.query.northing
      const address = request.query.address

      return h.view('map', new MapsViewModel(easting, northing, address))
    },
    validate: {
      query: {
        easting: Joi.number(),
        northing: Joi.number(),
        map: Joi.string(),
        address: Joi.number()
      }
    }
  }
}
