var moment = require('moment')
var maps = require('./maps.json')

function MapsViewModel (easting, northing, address) {
  this.maps = maps
  this.easting = easting
  this.northing = northing
  this.address = address
  this.local = !!easting
  this.date = Date.now()
  this.year = moment(Date.now()).format('YYYY')
  this.pageTitle = 'Long term flood risk map for England - GOV.UK'
}

module.exports = MapsViewModel
