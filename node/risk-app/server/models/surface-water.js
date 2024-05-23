function SurfaceWaterViewModel (riskProbability, address, llfa, backLink) {
  this.easting = address.x
  this.northing = address.y
  this.backLink = backLink
  this.riskProbability = riskProbability
  this.riskStyle = riskProbability.replace(/ /g, '-')
  this.llfa = llfa
}

module.exports = SurfaceWaterViewModel
