const RiskLevel = require('../risk-level')

module.exports = {
  loadPage: function (riskDetailPage, addressId) {
    riskDetailPage.loadPageWithAddress(addressId)
      .assert.title('Long Term Flood Risk Information - GOV.UK')
  },
  assertOutcome: function (riskDetailPage, data) {
    riskDetailPage.getInfo(function (info) {
      riskDetailPage.assert.equal(info.status, data.outcome)
      riskDetailPage.assert.equal(info.riverAndSeaRisk, data.riverAndSeaRisk)
      riskDetailPage.assert.equal(info.surfaceWaterRisk, data.surfaceWaterRisk)

      // River and sea tests
      riskDetailPage.assert.containsText('@riverAndSeaPanel', 'The flood risk from rivers or the sea is ' + info.riverAndSeaRisk.toLowerCase())
      switch (info.riverAndSeaRisk) {
        case RiskLevel.High:
          riskDetailPage.assert.containsText('@riverAndSeaPanel', 'High risk means that each year this area has a chance of flooding of greater than 3.3%.')
          break
        case RiskLevel.Medium:
          riskDetailPage.assert.containsText('@riverAndSeaPanel', 'Medium risk means that each year this area has a chance of flooding of between 1% and 3.3%.')
          break
        case RiskLevel.Low:
          riskDetailPage.assert.containsText('@riverAndSeaPanel', 'Low risk means that each year this area has a chance of flooding of between 0.1% and 1%.')
          break
        case RiskLevel.VeryLow:
          riskDetailPage.assert.containsText('@riverAndSeaPanel', 'Very low risk means that each year this area has a chance of flooding of less than 0.1%.')
          break
        default:
          throw new Error('Invalid Risk Level', info.riverAndSeaRisk)
      }

      // Surface water tests
      riskDetailPage.assert.containsText('@surfaceWaterPanel', 'The flood risk from surface water is ' + info.surfaceWaterRisk.toLowerCase())
      switch (info.surfaceWaterRisk) {
        case RiskLevel.High:
          riskDetailPage.assert.containsText('@surfaceWaterPanel', 'High risk means that each year this area has a chance of flooding of greater than 3.3%.')
          break
        case RiskLevel.Medium:
          riskDetailPage.assert.containsText('@surfaceWaterPanel', 'Medium risk means that each year this area has a chance of flooding of between 1% and 3.3%.')
          break
        case RiskLevel.Low:
          riskDetailPage.assert.containsText('@surfaceWaterPanel', 'Low risk means that each year this area has a chance of flooding of between 0.1% and 1%.')
          break
        case RiskLevel.VeryLow:
          riskDetailPage.assert.containsText('@surfaceWaterPanel', 'Very low risk means that each year this area has a chance of flooding of less than 0.1%.')
          break
        default:
          throw new Error('Invalid Risk Level', info.riverAndSeaRisk)
      }

      // Reservoir tests
      if (info.reservoirRisk) {
        riskDetailPage.assert.elementPresent('@reservoirPanel')
        riskDetailPage.assert.containsText('@reservoirPanel', 'There\'s a risk of flooding in this area from reservoirs')
      }
    })
  }
}
