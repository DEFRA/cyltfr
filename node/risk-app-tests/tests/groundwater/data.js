const RiskLevel = require('../../risk-level')
const RiskStatus = require('../../risk-status')

const data = [
  { postcode: 'DN19 7DJ', address: 100050180645, outcome: RiskStatus.AtRisk,
  riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.VeryLow, reservoirRisk: false },
{ postcode: 'DN19 7DJ', address: 100050180648, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.Low, reservoirRisk: false },
{ postcode: 'DN19 7DJ', address: 100050180651, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.Medium, reservoirRisk: false },
{ postcode: 'DN19 7DJ', address: 100050180657, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.High, reservoirRisk: false },
{ postcode: 'IP33 1YH', address: 100091098209, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.Low, surfaceWaterRisk: RiskLevel.High, reservoirRisk: false },
{ postcode: 'DN19 7DJ', address: 100050180652, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.Medium, surfaceWaterRisk: RiskLevel.Low, reservoirRisk: false },
{ postcode: 'DN19 7DT', address: 100050180226, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.Medium, surfaceWaterRisk: RiskLevel.Medium, reservoirRisk: false },
{ postcode: 'DN19 7DT', address: 100050180230, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.Medium, surfaceWaterRisk: RiskLevel.High, reservoirRisk: false },
{ postcode: 'DN19 7DJ', address: 100050180658, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.High, surfaceWaterRisk: RiskLevel.Medium, reservoirRisk: false },
{ postcode: 'CB8 0HL', address: 100091369361, outcome: RiskStatus.AtRisk,
riverAndSeaRisk: RiskLevel.High, surfaceWaterRisk: RiskLevel.High, reservoirRisk: false }
]

module.exports = data
