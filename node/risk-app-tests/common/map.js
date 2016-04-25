module.exports = {
  loadPageNoParams: function (mapPage) {
    mapPage.navigate()
      .assert.title('Long Term Flood Risk Information - GOV.UK')
      .assert.containsText('@heading', 'Learn more about this area\'s flood risk')
  },
  loadPageWithParams: function (mapPage, addressId, easting, northing, mapType) {
    mapPage.loadPageWithParams(addressId, easting, northing, mapType)
      .assert.title('Long Term Flood Risk Information - GOV.UK')
      .assert.containsText('#map-page h1', 'Learn more about this area\'s flood risk')
  },
  assertRiskAddressHidden: function (mapPage) {
    mapPage.assert.elementNotPresent('@riskAddressLink')
  },
  assertRiskAddressVisible: function (mapPage) {
    mapPage.assert.elementPresent('@riskAddressLink')
  },
  assertMapParentSelected: function (mapPage, mapType) {
    // selection relies on entire page to have loaded so wait
    mapPage.waitForElementPresent('.selected', 5000)
      .assert.cssClassPresent('@' + mapType, 'selected')
  },
  assertMapParentNotSelected: function (mapPage, mapType) {
    // selection relies on entire page to have loaded so wait
    mapPage.waitForElementPresent('.selected', 5000)
      .assert.cssClassNotPresent('@' + mapType, 'selected')
  },
  assertLayerSelected: function (mapPage, layer) {
    // not implemented
  },
  assertLayerNotSelected: function (mapPage, layer) {
    // not implemented
  }
}
