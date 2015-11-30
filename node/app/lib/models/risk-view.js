function RiskViewModel (data, address) {
  this.address = address
  this.severityClass = 'medium'
  this.severityText = 'MEDIUM RISK'
  this.easting = address.EASTING
  this.northing = address.NORTHING
}

module.exports = RiskViewModel
