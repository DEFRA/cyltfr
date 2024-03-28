const joi = require('joi')
const MapViewModel = require('../models/map-view')
const { defineBackLink } = require('../services/defineBackLink.js')

module.exports = {
  method: 'GET',
  path: '/map',
  options: {
    description: 'Get the map page',
    auth: {
      strategy: 'session',
      mode: 'required'
    },
    handler: (request, h) => {
      const { query } = request
      const { easting, northing } = query
      const address = request.yar.get('address')
      const path = request.path
      const backLinkUri = defineBackLink(path)
      const mapType = request.query.map
      let keyTitle

      if (mapType === 'RiversOrSea') {
        keyTitle = 'Rivers and the sea'
      } else if (mapType === 'SurfaceWater') {
        keyTitle = 'Surface water'
      } else {
        keyTitle = 'Key'
      }

      return h.view('map', new MapViewModel(easting, northing, address, backLinkUri, keyTitle))
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
