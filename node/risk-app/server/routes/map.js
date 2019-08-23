const joi = require('@hapi/joi')
const MapViewModel = require('../models/map-view')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    description: 'Get the map page',
    handler: (request, h) => {
      const { query } = request
      const { easting, northing, address } = query

      return h.view('map', new MapViewModel(easting, northing, address))
    },
    validate: {
      query: {
        easting: joi.number(),
        northing: joi.number(),
        map: joi.string(),
        address: joi.number()
      }
    }
  }
}
