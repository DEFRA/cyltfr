function RiversAndSeaViewModel (riskProbability, address, backLink) {
  this.easting = address.x
  this.northing = address.y
  this.backLink = backLink
  this.riskProbability = riskProbability
  this.riskStyle = riskProbability.replace(/ /g, '-')
}

module.exports = RiversAndSeaViewModel
