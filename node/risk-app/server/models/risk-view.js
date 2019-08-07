const moment = require('moment')
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

function RiskViewModel (risk, address) {
  const inTargetArea = risk.inFloodWarningArea || risk.inFloodAlertArea
  const riverAndSeaRisk = risk.riverAndSeaRisk
    ? risk.riverAndSeaRisk.probabilityForBand
    : RiskLevel.VeryLow
  const surfaceWaterRisk = risk.surfaceWaterRisk || RiskLevel.VeryLow
  const reservoirRisk = !!(risk.reservoirRisk && risk.reservoirRisk.length)

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
  this.reservoirRisk = reservoirRisk

  this.riverAndSeaRiskIsHigh = riverAndSeaRisk === RiskLevel.High
  this.riverAndSeaRiskIsMedium = riverAndSeaRisk === RiskLevel.Medium
  this.riverAndSeaRiskIsLow = riverAndSeaRisk === RiskLevel.Low
  this.riverAndSeaRiskIsVeryLow = riverAndSeaRisk === RiskLevel.VeryLow
  this.surfaceWaterRiskIsHigh = surfaceWaterRisk === RiskLevel.High
  this.surfaceWaterRiskIsMedium = surfaceWaterRisk === RiskLevel.Medium
  this.surfaceWaterRiskIsLow = surfaceWaterRisk === RiskLevel.Low
  this.surfaceWaterRiskIsVeryLow = surfaceWaterRisk === RiskLevel.VeryLow

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
  this.className = this.isRisk ? 'at-risk' : 'low-risk'
  this.date = Date.now()
  this.year = moment(Date.now()).format('YYYY')
  this.pageTitle = 'Your long term flood risk assessment - GOV.UK'

  this.testInfoJSON = JSON.stringify({
    status: this.status,
    riverAndSeaRisk: riverAndSeaRisk,
    surfaceWaterRisk: surfaceWaterRisk,
    reservoirRisk: reservoirRisk
  })

  this.me = JSON.stringify(this, null, 2)
}

module.exports = RiskViewModel
