function GroundWaterViewModel (reservoirRisk, groundWaterRisk, address, backLink) {
  const reservoirRiskText = reservoirRisk ? 'There is a risk of flooding from reservoirs in this area' : 'Flooding from reservoirs is unlikely in this area'
  const groundWaterRiskText = groundWaterRisk ? 'Flooding is possible when groundwater levels are high' : 'Flooding from groundwater is unlikely in this area'

  this.easting = address.x
  this.northing = address.y
  this.backLink = backLink
  this.reservoirRisk = reservoirRisk
  this.reservoirRiskText = reservoirRiskText
  this.groundWaterRiskText = groundWaterRiskText
}

module.exports = GroundWaterViewModel
