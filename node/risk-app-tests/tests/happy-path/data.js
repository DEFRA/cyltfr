const RiskStatus = {
  AtRisk: 1,
  AtRiskMonitor: 2,
  LowRisk: 3,
  VeryLowRisk: 4
}

const data = [
  { postcode: 'M22 4EN', address: 77079867, 'outcome': RiskStatus.AtRisk },
  { postcode: 'L4 9XT', address: 38183034, 'outcome': RiskStatus.AtRiskMonitor },
  { postcode: 'WA3 2GG', address: 100011748628, 'outcome': RiskStatus.LowRisk },
  { postcode: 'CW8 4BH', address: 100010192035, 'outcome': RiskStatus.VeryLowRisk }
]

module.exports = data
