var riskLevels = {
  'very low': 0,
  'low': 1,
  'medium': 2,
  'high': 3
}

var sources = {
  'RiversOrSea': {
    ref: 'RiversOrSea',
    text: 'River and sea'
  },
  'SurfaceWater': {
    ref: 'SurfaceWater',
    text: 'Surface water'
  },
  'Reservoirs': {
    ref: 'Reservoirs',
    text: 'Reservoir'
  }
}

function RiskViewModel (risk, address) {
/*  var rofrsVal, sfVal
  rofrsVal = risk.rofrs_risk ? riskLevels[risk.rofrs_risk.prob_4band.toLowerCase()] : -1
  sfVal = risk.surface_water_risk ? riskLevels[risk.surface_water_risk.toLowerCase()] : -1

  this.severityText = (sfVal > rofrsVal ? risk.surface_water_risk : risk.rofrs_risk.prob_4band).toUpperCase()
  this.severityClass = this.severityText.toLowerCase()

  // Need to build up sources of flooding in their correct severity order
  this.sources = []

  if (rofrsVal >= sfVal) {
    this.sources.push(sources.RiversOrSea)
    this.sources.push(sources.SurfaceWater)
  } else if (rofrsVal > -1) {
    this.sources.push(sources.SurfaceWater)
    this.sources.push(sources.RiversOrSea)
  } else {
    this.sources.push(sources.SurfaceWater)
  }

  if (risk.reservoir_risk) {
    this.sources.push(sources.Reservoirs)
  }
*/
  this.fullAddress = address.fullAddress
  this.targetArea = risk.in_flood_alert_area || risk.in_flood_warning_area
  this.easting = address.easting
  this.northing = address.northing

  // just dump out risk data for time being
  this.allData = JSON.stringify(risk)
}

module.exports = RiskViewModel
