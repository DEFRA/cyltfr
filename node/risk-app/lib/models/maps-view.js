function MapsViewModel (maps, easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.date = Date.now()
}

module.exports = MapsViewModel
