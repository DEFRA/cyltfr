function RiskViewModel (data, address) {
  this.fullAddress = address.fullAddress
  this.severityClass = 'medium'
  this.severityText = 'MEDIUM RISK'
  this.easting = address.easting
  this.northing = address.northing
}

module.exports = RiskViewModel
