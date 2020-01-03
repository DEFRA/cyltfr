const util = require('../util')
const suitability = require('./suitability')

const RiskLevel = {
  VeryLow: 'Very Low',
  Low: 'Low',
  Medium: 'Medium',
  High: 'High'
}

const RiskTitles = {
  'Very Low': 'Very low risk',
  Low: 'Low risk',
  Medium: 'Medium risk',
  High: 'High risk'
}

const RiskDescriptions = {
  'Very Low': 'Very low risk means that each year this area has a chance of flooding of less than 0.1%',
  Low: 'Low risk means that each year this area has a chance of flooding of between 0.1% and 1%',
  Medium: 'Medium risk means that each year this area has a chance of flooding of between 1.1% and 3.3%',
  High: 'High risk means that each year this area has a chance of flooding of greater than 3.3%'
}

const Levels = Object.keys(RiskLevel).map(l => RiskLevel[l])

function RiskViewModel (risk, address) {
  const riverAndSeaRisk = risk.riverAndSeaRisk
    ? risk.riverAndSeaRisk.probabilityForBand
    : RiskLevel.VeryLow
  const surfaceWaterRisk = risk.surfaceWaterRisk || RiskLevel.VeryLow
  const reservoirRisk = !!(risk.reservoirRisk && risk.reservoirRisk.length)

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

  // River and sea suitability
  const riverAndSeaSuitability = risk.riverAndSeaRisk && risk.riverAndSeaRisk.suitability
  if (riverAndSeaSuitability) {
    const name = riverAndSeaSuitability.toLowerCase()
    this.riverAndSeaSuitability = suitability.riverAndSea[name]
    this.riverAndSeaSuitabilityName = `partials/suitability/${name.replace(/ /g, '-')}.html`
  }

  // Surface water suitability
  const surfaceWaterSuitability = risk.surfaceWaterSuitability
  if (surfaceWaterSuitability) {
    const name = surfaceWaterSuitability.toLowerCase()
    this.surfaceWaterSuitability = suitability.surfaceWater[name]
    this.surfaceWaterSuitabilityName = `partials/suitability/${name.replace(/ /g, '-')}.html`
  }

  // Groundwater area
  this.isGroundwaterArea = risk.isGroundwaterArea
  this.extraInfo = risk.extraInfo

  this.hasHoldingComments = false
  this.hasLlfaComments = false

  // Extra info
  if (Array.isArray(risk.extraInfo) && risk.extraInfo.length) {
    const maxComments = 3
    const llfaDescriptions = {
      'Flood report': 'Historical flooding reports',
      'Non compliant mapping': 'LLFA flood maps',
      'Proposed schemes': 'Proposed flood protection schemes',
      'Completed schemes': 'Completed flood protection schemes',
      'Flood action plan': 'A flood action plan',
      'Other info': 'Other information, for example, engineer’s reports'
    }

    this.holdingComments = risk.extraInfo
      .filter(comment => comment.apply === 'holding')
      .map(comment => comment.info)
      .filter(info => info)
      .slice(0, maxComments)

    this.llfaComments = risk.extraInfo
      .filter(comment => comment.apply === 'llfa')
      .map(comment => comment.info)
      .filter(info => info)
      .filter((info, idx, arr) => arr.indexOf(info) === idx)
      .map(info => llfaDescriptions[info])
      .filter(info => info)

    this.hasHoldingComments = !!this.holdingComments.length
    this.hasLlfaComments = !!this.llfaComments.length
  }

  this.easting = address.x
  this.northing = address.y
  this.postcode = address.postcode
  this.lines = address.address.split(', ')
  this.address = address
  this.surfaceWaterManagement = risk.leadLocalFloodAuthority
  this.leadLocalFloodAuthority = risk.leadLocalFloodAuthority
  this.date = Date.now()
  this.year = new Date().getFullYear()

  this.riversAndSeaTitle = RiskTitles[riverAndSeaRisk]
  this.surfaceWaterTitle = RiskTitles[surfaceWaterRisk]
  this.riversAndSeaText = RiskDescriptions[riverAndSeaRisk]
  this.surfaceWaterText = RiskDescriptions[surfaceWaterRisk]

  const riversAndSeaLevel = Levels.indexOf(riverAndSeaRisk)
  const surfaceWaterLevel = Levels.indexOf(surfaceWaterRisk)
  const riversAndSeaIsFirst = riversAndSeaLevel >= surfaceWaterLevel

  if (riversAndSeaIsFirst) {
    this.firstSource = 'partials/rivers-sea.html'
    this.secondSource = 'partials/surface-water.html'
  } else {
    this.firstSource = 'partials/surface-water.html'
    this.secondSource = 'partials/rivers-sea.html'
  }

  this.testInfo = JSON.stringify({
    riverAndSeaRisk: riverAndSeaRisk,
    surfaceWaterRisk: surfaceWaterRisk,
    reservoirRisk: reservoirRisk,
    isGroundwaterArea: risk.isGroundwaterArea
  })
}

module.exports = RiskViewModel
