var moment = require('moment')

function MapsViewModel (maps, easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.date = Date.now()
  this.year = moment(Date.now()).format('YYYY')
}

module.exports = MapsViewModel
