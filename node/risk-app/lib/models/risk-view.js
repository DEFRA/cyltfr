var helpers = require('../helpers')

const RiskStatus = {
  AtRisk: 1,
  AtRiskMonitor: 2,
  LowRisk: 3,
  VeryLowRisk: 4
}

const RiskLevel = {
  VeryLow: 'Very Low',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High'
}

function RiskViewModel (risk, address) {
  const inTargetArea = risk.inFloodWarningArea || risk.inFloodAlertArea
  const riverAndSeaRisk = risk.riverAndSeaRisk ? risk.riverAndSeaRisk.probabilityForBand : RiskLevel.VeryLow
  const surfaceWaterRisk = risk.surfaceWaterRisk || RiskLevel.VeryLow
  const reservoirRisk = risk.reservoirRisk ? RiskLevel.High : RiskLevel.Low

  if (inTargetArea) {
    this.status = RiskStatus.AtRisk
  } else {
    if ((riverAndSeaRisk === RiskLevel.High || riverAndSeaRisk === RiskLevel.Medium) ||
        (surfaceWaterRisk === RiskLevel.High || surfaceWaterRisk === RiskLevel.Medium)) {
      this.status = RiskStatus.AtRiskMonitor
    } else {
      if (riverAndSeaRisk === RiskLevel.VeryLow && surfaceWaterRisk === RiskLevel.VeryLow) {
        this.status = RiskStatus.VeryLowRisk
      } else {
        this.status = RiskStatus.LowRisk
      }
    }
  }

  this.isAtRisk = this.status === RiskStatus.AtRisk
  this.isAtRiskMonitor = this.status === RiskStatus.AtRiskMonitor
  this.isLowRisk = this.status === RiskStatus.LowRisk
  this.isVeryLowRisk = this.status === RiskStatus.VeryLowRisk
  this.isRisk = this.isAtRisk || this.isAtRiskMonitor

  this.riverAndSeaRisk = riverAndSeaRisk.toLowerCase()
  this.surfaceWaterRisk = surfaceWaterRisk.toLowerCase()
  this.reservoirRisk = reservoirRisk.toLowerCase()

  if (risk.reservoirRisk) {
    this.reservoirs = risk.reservoirRisk.map(function (item) {
      return {
        name: item.reservoirName,
        owner: item.isUtilityCompany,
        authority: item.leadLocalFloodAuthority,
        location: helpers.convertLocationToNGR(item.location)
      }
    })
  }

  this.extraInfo = risk.extraInfo
  this.easting = address.x
  this.northing = address.y
  this.postcode = address.postcode
  this.lines = address.address.split(', ')
  this.address = address.uprn
  this.surfaceWaterManagement = risk.leadLocalFloodAuthority
  this.leadLocalFloodAuthority = risk.leadLocalFloodAuthority
  this.className = this.isRisk ? 'at-risk' : 'low-risk'
  this.date = Date.now()
}

module.exports = RiskViewModel
