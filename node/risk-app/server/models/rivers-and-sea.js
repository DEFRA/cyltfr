function RiversAndSeaViewModel (riskProbability, address, backLink) {
  let riskColour

  if (riskProbability === 'High') {
    riskColour = 'red'
  } else if (riskProbability === 'Medium') {
    riskColour = 'orange'
  } else if (riskProbability === 'Low') {
    riskColour = 'yellow'
  } else {
    riskColour = ''
  }

  this.easting = address.x
  this.northing = address.y
  this.backLink = backLink
  this.riskProbability = riskProbability
  this.riskColour = riskColour
}

module.exports = RiversAndSeaViewModel
