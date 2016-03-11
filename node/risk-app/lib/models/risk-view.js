var RiskLevel = {
  AtRisk: 1,
  AtRiskMonitor: 2,
  LowRisk: 3,
  VeryLowRisk: 4
}

function RiskViewModel (risk, address) {
  var inTargetArea = risk.inFloodWarningArea || risk.inFloodAlertArea
  var isReservoirRisk = !!risk.reservoirRisk
  var riverAndSeaRisk = risk.riverAndSeaRisk && risk.riverAndSeaRisk.probabilityForBand
  var surfaceWaterRisk = risk.surfaceWaterRisk

  if (inTargetArea) {
    this.status = RiskLevel.AtRisk
  } else {
    if ((!riverAndSeaRisk || riverAndSeaRisk === 'Low') && !isReservoirRisk) {
      this.status = surfaceWaterRisk === 'Low' ? RiskLevel.LowRisk : RiskLevel.VeryLowRisk
    } else {
      this.status = RiskLevel.AtRiskMonitor
    }
  }

  this.isAtRisk = this.status === RiskLevel.AtRisk
  this.isAtRiskMonitor = this.status === RiskLevel.AtRiskMonitor
  this.isLowRisk = this.status === RiskLevel.LowRisk
  this.isVeryLowRisk = this.status === RiskLevel.VeryLowRisk
  this.isRisk = this.isAtRisk || this.isAtRiskMonitor

  this.easting = address.X_COORDINATE
  this.northing = address.Y_COORDINATE
  this.postcode = address.postcode
  this.lines = address.ADDRESS.split(', ')
  this.address = address.UPRN
  this.className = this.isRisk ? 'at-risk' : 'low-risk'
  this.date = Date.now()
}

module.exports = RiskViewModel
