function MapsViewModel (maps, easting, northing) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.date = Date.now()
}

module.exports = MapsViewModel
