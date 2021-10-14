const util = require('../util')

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
  'Very Low': 'Very low risk means that each year this area has a chance of flooding of less than 0.1%.',
  Low: 'Low risk means that each year this area has a chance of flooding of between 0.1% and 1%.',
  Medium: 'Medium risk means that each year this area has a chance of flooding of between 1% and 3.3%.',
  High: 'High risk means that each year this area has a chance of flooding of greater than 3.3%.'
}

const Levels = Object.keys(RiskLevel).map(l => RiskLevel[l])

const suitabilities = [
  'county to town',
  'national to county',
  'street to parcels of land',
  'town to street'
]

function RiskViewModel (risk, address) {
  const riverAndSeaRisk = risk.riverAndSeaRisk
    ? risk.riverAndSeaRisk.probabilityForBand
    : RiskLevel.VeryLow
  const surfaceWaterRisk = risk.surfaceWaterRisk || RiskLevel.VeryLow
  const reservoirDryRisk = !!(risk.reservoirDryRisk && risk.reservoirDryRisk.length)
  const reservoirWetRisk = !!(risk.reservoirWetRisk && risk.reservoirWetRisk.length)
  const reservoirRisk = reservoirDryRisk || reservoirWetRisk

  this.riverAndSeaRisk = riverAndSeaRisk
  this.surfaceWaterRisk = surfaceWaterRisk
  this.riverAndSeaClassName = riverAndSeaRisk.toLowerCase().replace(' ', '-')
  this.surfaceWaterClassName = surfaceWaterRisk.toLowerCase().replace(' ', '-')
  this.reservoirRisk = reservoirRisk

  if (reservoirRisk) {
    const reservoirs = []

    const add = function (item) {
      reservoirs.push({
        name: item.reservoirName,
        owner: item.undertaker,
        authority: item.leadLocalFloodAuthority,
        location: item.location,
        riskDesignation: item.riskDesignation,
        comments: item.comments
      })
    }

    if (reservoirDryRisk) {
      risk.reservoirDryRisk.forEach(add)
    }

    if (reservoirWetRisk) {
      risk.reservoirWetRisk.forEach(function (item) {
        const exists = !!reservoirs.find(r => r.location === item.location)

        if (!exists) {
          add(item)
        }
      })
    }

    this.reservoirs = reservoirs
  }

  // River and sea suitability
  const riverAndSeaSuitability = risk.riverAndSeaRisk && risk.riverAndSeaRisk.suitability
  if (riverAndSeaSuitability) {
    const name = riverAndSeaSuitability.toLowerCase()
    if (suitabilities.includes(name)) {
      this.riverAndSeaSuitabilityName = `partials/suitability/${name.replace(/ /g, '-')}.html`
    }
  }

  // Surface water suitability
  const surfaceWaterSuitability = risk.surfaceWaterSuitability
  if (surfaceWaterSuitability) {
    const name = surfaceWaterSuitability.toLowerCase()
    if (suitabilities.includes(name)) {
      this.surfaceWaterSuitabilityName = `partials/suitability/${name.replace(/ /g, '-')}.html`
    }
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
      'Non compliant mapping': 'Additional local flood maps',
      'Proposed schemes': 'Potential new flood protection schemes',
      'Completed schemes': 'Completed flood protection schemes',
      'Flood action plan': 'A flood action plan',
      'Other info': 'Other information, for example, engineer’s reports or land drainage consents'
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
