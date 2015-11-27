function RiskViewModel (data, address) {
  this.address = address.text
  this.severityClass = 'medium'
  this.severityText = 'MEDIUM RISK'
  this.easting = address.easting
  this.northing = address.northing
}

module.exports = RiskViewModel
