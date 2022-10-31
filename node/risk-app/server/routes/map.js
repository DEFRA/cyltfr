const joi = require('joi')
const MapViewModel = require('../models/map-view')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    description: 'Get the map page',
    handler: (request, h) => {
      const { query } = request
      const { easting, northing } = query
      const address = request.yar.get('address')

      return h.view('map', new MapViewModel(easting, northing, address))
    },
    validate: {
      query: joi.object().keys({
        easting: joi.number(),
        northing: joi.number(),
        map: joi.string()
      }).required()
    }
  }
}
