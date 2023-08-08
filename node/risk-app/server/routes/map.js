const joi = require('joi')
const MapViewModel = require('../models/map-view')
const { defineBackLink } = require('../services/defineBackLink.js')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    description: 'Get the map page',
    handler: (request, h) => {
      const { query } = request
      const { easting, northing } = query
      const address = request.yar.get('address')
      const mapPageQuery = request.orig
      const path = request.path
      console.log(request)
      const backLinkUri = defineBackLink(path, mapPageQuery)

      return h.view('map', new MapViewModel(easting, northing, address, backLinkUri))
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
