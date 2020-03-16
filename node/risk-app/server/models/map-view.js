const maps = require('./maps.json')

function MapViewModel (easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.date = Date.now()
  this.year = new Date().getFullYear()
}

module.exports = MapViewModel
