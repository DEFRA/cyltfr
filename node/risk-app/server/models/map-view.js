const maps = require('./maps.json')

function MapViewModel (easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.noIndex = this.local
  this.date = Date.now()
  this.year = new Date().getFullYear()
  this.pageTitle = 'Long term flood risk map for England - GOV.UK'
}

module.exports = MapViewModel
