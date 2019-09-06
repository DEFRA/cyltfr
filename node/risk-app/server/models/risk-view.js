const util = require('../util')
const suitability = require('./suitability')

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

const RiskDescriptions = {
  'Very Low': 'Very low risk - less than 0.1% chance each year',
  Low: 'Low risk - between 0.1% and 1% chance each year',
  Medium: 'Medium risk - between 1.1% and 3.3% chance each year',
  High: 'High risk - greater than 3.3% chance each year'
}

function RiskViewModel (risk, address) {
  const inTargetArea = risk.inFloodWarningArea || risk.inFloodAlertArea
  const riverAndSeaRisk = risk.riverAndSeaRisk
    ? risk.riverAndSeaRisk.probabilityForBand
    : RiskLevel.VeryLow
  const surfaceWaterRisk = risk.surfaceWaterRisk || RiskLevel.VeryLow
  const reservoirRisk = !!(risk.reservoirRisk && risk.reservoirRisk.length)

  // Set status
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

  // this.isAtRisk = this.status === RiskStatus.AtRisk
  // this.isAtRiskMonitor = this.status === RiskStatus.AtRiskMonitor
  // this.isLowRisk = this.status === RiskStatus.LowRisk
  // this.isVeryLowRisk = this.status === RiskStatus.VeryLowRisk
  // this.isRisk = this.isAtRisk || this.isAtRiskMonitor

  this.riverAndSeaRisk = riverAndSeaRisk
  this.surfaceWaterRisk = surfaceWaterRisk
  this.riverAndSeaClassName = riverAndSeaRisk.toLowerCase().replace(' ', '-')
  this.surfaceWaterClassName = surfaceWaterRisk.toLowerCase().replace(' ', '-')
  this.reservoirRisk = reservoirRisk

  if (reservoirRisk) {
    this.reservoirs = risk.reservoirRisk.map(function (item) {
      return {
        name: item.reservoirName,
        owner: item.isUtilityCompany,
        authority: item.leadLocalFloodAuthority,
        location: util.convertLocationToNGR(item.location),
        riskDesignation: item.riskDesignation,
        comments: item.comments
      }
    })
  }

  // River and Sea suitability
  const riverAndSeaSuitability = risk.riverAndSeaRisk && risk.riverAndSeaRisk.suitability
  if (riverAndSeaSuitability) {
    this.riverAndSeaSuitability = suitability.riverAndSea[riverAndSeaSuitability.toLowerCase()]
  }

  // Surface water suitability
  const surfaceWaterSuitability = risk.surfaceWaterSuitability
  if (surfaceWaterSuitability) {
    this.surfaceWaterSuitability = suitability.surfaceWater[surfaceWaterSuitability.toLowerCase()]
  }

  // Groundwater area
  this.isGroundwaterArea = risk.isGroundwaterArea

  this.extraInfo = risk.extraInfo
  this.easting = address.x
  this.northing = address.y
  this.postcode = address.postcode
  this.lines = address.address.split(', ')
  this.address = address.uprn
  this.surfaceWaterManagement = risk.leadLocalFloodAuthority
  this.leadLocalFloodAuthority = risk.leadLocalFloodAuthority
  this.date = Date.now()
  this.year = new Date().getFullYear()

  this.testInfo = {
    status: this.status,
    riverAndSeaRisk: riverAndSeaRisk,
    surfaceWaterRisk: surfaceWaterRisk,
    reservoirRisk: reservoirRisk,
    isGroundwaterArea: risk.isGroundwaterArea
  }

  this.riversAndSeaText = RiskDescriptions[riverAndSeaRisk]
  this.surfaceWaterText = RiskDescriptions[surfaceWaterRisk]
}

module.exports = RiskViewModel
