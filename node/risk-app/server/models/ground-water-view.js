function GroundWaterViewModel (riskProbability, address, backLink) {
  this.easting = address.x
  this.northing = address.y
  this.backLink = backLink
  this.riskProbability = riskProbability
}

module.exports = GroundWaterViewModel
