const RiskLevel = require('../../risk-level')
const RiskStatus = require('../../risk-status')

const data = [
  { postcode: 'M22 4EN', address: 77079867, outcome: RiskStatus.AtRisk,
  riverAndSeaRisk: RiskLevel.Low, surfaceWaterRisk: RiskLevel.VeryLow },
  { postcode: 'L4 9XT', address: 38183034, outcome: RiskStatus.AtRiskMonitor,
  riverAndSeaRisk: RiskLevel.Medium, surfaceWaterRisk: RiskLevel.Low },
  { postcode: 'WA3 2GG', address: 100011748628, outcome: RiskStatus.LowRisk,
  riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.Low },
  { postcode: 'CW8 4BH', address: 100010192035, outcome: RiskStatus.VeryLowRisk,
  riverAndSeaRisk: RiskLevel.VeryLow, surfaceWaterRisk: RiskLevel.VeryLow }
]

module.exports = data
