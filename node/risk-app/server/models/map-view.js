const maps = require('./maps.json')

function MapViewModel (easting, northing, address, backLinkUri, keyTitle) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.date = Date.now()
  this.year = new Date().getFullYear()
  this.backLink = backLinkUri
  this.keyTitle = keyTitle
}

module.exports = MapViewModel
