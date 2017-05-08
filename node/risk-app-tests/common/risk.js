const RiskStatus = require('../risk-status')
const RiskLevel = require('../risk-level')

module.exports = {
  loadPage: function (riskPage, addressId) {
    riskPage.loadPageWithAddress(addressId)
      .assert.title('Long term flood risk assessment for locations in England - GOV.UK')
  },
  assertOutcome: function (riskPage, data) {
    riskPage.getInfo(function (info) {
      console.log('POSTCODE: ', data.postcode)
      riskPage.assert.equal(info.status, data.outcome)
      riskPage.assert.equal(info.riverAndSeaRisk, data.riverAndSeaRisk)
      riskPage.assert.equal(info.surfaceWaterRisk, data.surfaceWaterRisk)
      riskPage.assert.equal(info.reservoirRisk, data.reservoirRisk)

      // Check the heading
      if (info.status === RiskStatus.AtRisk) {
        if (info.surfaceWaterRisk !== RiskLevel.VeryLow) {
          riskPage.assert.containsText('@heading', 'This address is in or near a flood risk area')
          riskPage.assert.containsText('@lastItem', 'This address is in or near a flood risk area.')
        } else {
          riskPage.assert.containsText('@heading', 'This address is in a flood risk area')
          riskPage.assert.containsText('@lastItem', 'This address is in a flood risk area.')
        }
        riskPage.assert.containsText('@firstItem', 'This service is free. You can get warnings by phone, email or text message.')
        riskPage.assert.containsText('@lastItem', 'The flood risk from rivers or the sea is ' + data.riverAndSeaRisk.toLowerCase())
        riskPage.assert.containsText('@lastItem', 'The flood risk from surface water is ' + data.surfaceWaterRisk.toLowerCase())
        if (info.reservoirRisk) {
          riskPage.assert.containsText('@lastItem', 'There\'s a risk of flooding in this area from reservoirs')
        }
      } else if (info.status === RiskStatus.AtRiskMonitor) {
        if (info.surfaceWaterRisk !== RiskLevel.VeryLow) {
          riskPage.assert.containsText('@heading', 'This address is in or near a flood risk area')
          riskPage.assert.containsText('@lastItem', 'This address is in or near a flood risk area.')
        } else {
          riskPage.assert.containsText('@heading', 'This address is in a flood risk area')
          riskPage.assert.containsText('@lastItem', 'This address is in a flood risk area.')
        }
        riskPage.assert.containsText('@firstItem', 'Use radio, television and social media to keep up to date with flood events and weather conditions in your area')
        riskPage.assert.containsText('@lastItem', 'The flood risk from rivers or the sea is ' + data.riverAndSeaRisk.toLowerCase())
        riskPage.assert.containsText('@lastItem', 'The flood risk from surface water is ' + data.surfaceWaterRisk.toLowerCase())
        if (info.reservoirRisk) {
          riskPage.assert.containsText('@lastItem', 'There\'s a risk of flooding in this area from reservoirs')
        }
      } else if (info.status === RiskStatus.LowRisk) {
        riskPage.assert.containsText('@heading', 'This address is in an area at low risk of flooding')
      } else if (info.status === RiskStatus.VeryLowRisk) {
        riskPage.assert.containsText('@heading', 'This address is in an area at very low risk of flooding')
      }
    })
  },
  assertOutcomeGW: function (riskPage, data) {
    riskPage.getInfo(function (info) {
      console.log('POSTCODE: ', data.postcode)
      riskPage.assert.equal(info.status, data.outcome)
      riskPage.assert.equal(info.riverAndSeaRisk, data.riverAndSeaRisk)
      riskPage.assert.equal(info.surfaceWaterRisk, data.surfaceWaterRisk)
      riskPage.assert.equal(info.reservoirRisk, data.reservoirRisk)
      if (info.surfaceWaterRisk !== RiskLevel.VeryLow) {
        riskPage.assert.containsText('@heading', 'This address is in or near a flood risk area')
        riskPage.assert.containsText('@lastItem', 'This address is in or near a flood risk area.')
      } else {
        riskPage.assert.containsText('@heading', 'This address is in a flood risk area')
        riskPage.assert.containsText('@lastItem', 'This address is in a flood risk area.')
      }
      riskPage.assert.containsText('@firstItem', 'This service is free. You can get warnings by phone, email or text message.')
      riskPage.assert.containsText('@lastItem', 'The flood risk from rivers or the sea is ' + data.riverAndSeaRisk.toLowerCase())
      riskPage.assert.containsText('@lastItem', 'The flood risk from surface water is ' + data.surfaceWaterRisk.toLowerCase())
      riskPage.assert.containsText('@groundwater', 'When groundwater levels are high there may be flooding and disruption in the local area.')
    })
  }
}
