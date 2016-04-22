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

      // Check the heading
      // if (info.status === RiskStatus.AtRisk) {
      //   riskDetailPage.assert.containsText('@heading', 'This address is in a flood risk area')
      //   riskDetailPage.assert.containsText('@firstItem', 'This service is free. You can get warnings by phone, email or text message.')
      //   riskDetailPage.assert.containsText('@lastItem', 'This address is in a flood risk area.')
      //   riskDetailPage.assert.containsText('@lastItem', 'The flood risk from rivers or the sea is ' + data.riverAndSeaRisk.toLowerCase())
      //   riskDetailPage.assert.containsText('@lastItem', 'The flood risk from surface water is ' + data.surfaceWaterRisk.toLowerCase())
      // } else if (info.status === RiskStatus.AtRiskMonitor) {
      //   riskDetailPage.assert.containsText('@heading', 'This address is in a flood risk area')
      //   riskDetailPage.assert.containsText('@firstItem', 'Use radio, television and social media to keep up to date with flood events and weather conditions in your area')
      //   riskDetailPage.assert.containsText('@lastItem', 'This address is in a flood risk area.')
      //   riskDetailPage.assert.containsText('@lastItem', 'The flood risk from rivers or the sea is ' + data.riverAndSeaRisk.toLowerCase())
      //   riskDetailPage.assert.containsText('@lastItem', 'The flood risk from surface water is ' + data.surfaceWaterRisk.toLowerCase())
      // } else if (info.status === RiskStatus.LowRisk) {
      //   riskDetailPage.assert.containsText('@heading', 'This address is in an area at low risk of flooding')
      // } else if (info.status === RiskStatus.VeryLowRisk) {
      //   riskDetailPage.assert.containsText('@heading', 'This address is in an area at very low risk of flooding')
      // }
    })
  }
}
