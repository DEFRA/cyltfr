const moment = require('moment')
const maps = require('./maps.json')

function MapViewModel (easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.noIndex = this.local
  this.date = Date.now()
  this.year = moment(Date.now()).format('YYYY')
  this.pageTitle = 'Long term flood risk map for England - GOV.UK'
}

module.exports = MapViewModel
