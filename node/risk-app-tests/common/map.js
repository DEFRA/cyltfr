module.exports = {
  loadPageNoParams: function (mapPage, callback) {
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
  assertMapSelected: function (mapPage, mapType) {
    // selection relies on entire page to have loaded so wait
    mapPage.waitForElementPresent('.selected', 5000)
      .assert.cssClassPresent('@' + mapType, 'selected')
  },
  assertMapNotSelected: function (mapPage, mapType) {
    // selection relies on entire page to have loaded so wait
    mapPage.waitForElementPresent('.selected', 5000)
      .assert.cssClassNotPresent('@' + mapType, 'selected')
  },
  assertIsDetailedView: function (mapPage) {
    mapPage.assert.cssClassPresent('@mapContainer', 'detailed')
    // Rivers and sea
    mapPage.assert.visible('@RiversOrSea_1-ROFRS')
    mapPage.assert.visible('@RiversOrSea_2-FWLRSF')

    // Surface water
    mapPage.assert.visible('@SurfaceWater_6-SW-Extent')
    mapPage.assert.visible('@SurfaceWater_9-SWDH')
    mapPage.assert.visible('@SurfaceWater_12-SWVH')
    mapPage.assert.visible('@SurfaceWater_8-SWDM')
    mapPage.assert.visible('@SurfaceWater_11-SWVM')
    mapPage.assert.visible('@SurfaceWater_7-SWDL')
    mapPage.assert.visible('@SurfaceWater_10-SWVL')

    // reservoirs
    mapPage.assert.visible('@Reservoirs_3-ROFR')
    mapPage.assert.visible('@Reservoirs_4-DOFR')
    mapPage.assert.visible('@Reservoirs_5-SOFR')
  },
  assertIsBasicView: function (mapPage) {
    mapPage.assert.cssClassNotPresent('@mapContainer', 'detailed')

    // Rivers and sea
    mapPage.assert.visible('@RiversOrSea_1-ROFRS')
    mapPage.assert.hidden('@RiversOrSea_2-FWLRSF')

    // Surface water
    mapPage.assert.visible('@SurfaceWater_6-SW-Extent')
    mapPage.assert.hidden('@SurfaceWater_9-SWDH')
    mapPage.assert.hidden('@SurfaceWater_12-SWVH')
    mapPage.assert.hidden('@SurfaceWater_8-SWDM')
    mapPage.assert.hidden('@SurfaceWater_11-SWVM')
    mapPage.assert.hidden('@SurfaceWater_7-SWDL')
    mapPage.assert.hidden('@SurfaceWater_10-SWVL')

    // reservoirs
    mapPage.assert.visible('@Reservoirs_3-ROFR')
    mapPage.assert.hidden('@Reservoirs_4-DOFR')
    mapPage.assert.hidden('@Reservoirs_5-SOFR')
  },
  mobile: {
    assertMapSelected: function (mapPage, mapType) {
      console.log('not implemented!!')
    },
    assertMapNotSelected: function (mapPage, mapType) {
      console.log('not implemented!!')
    }
  }
}
