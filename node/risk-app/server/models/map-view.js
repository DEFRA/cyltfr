const maps = require('./maps.json')

function MapViewModel (easting, northing, address, backLinkUri) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.date = Date.now()
  this.year = new Date().getFullYear()
  this.backLink = backLinkUri
}

module.exports = MapViewModel
