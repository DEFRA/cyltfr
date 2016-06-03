module.exports = {
  loadPageNoParams: function (mapPage, callback) {
    mapPage.navigate()
      .assert.title('Long Term Flood Risk Information - GOV.UK')
      .assert.containsText('@heading', 'Learn more about this area\'s flood risk')
      .waitForElementVisible('#map-page button.ol-zoom-in', 20000)
  },
  loadPageWithParams: function (mapPage, addressId, easting, northing, mapType) {
    mapPage.loadPageWithParams(addressId, easting, northing, mapType)
      .assert.title('Long Term Flood Risk Information - GOV.UK')
      .assert.containsText('#map-page h1', 'Learn more about this area\'s flood risk')
      .waitForElementVisible('#map-page button.ol-zoom-in', 20000)
  },
  assertRiskAddressHidden: function (mapPage) {
    mapPage.assert.elementNotPresent('@riskAddressLink')
  },
  assertRiskAddressVisible: function (mapPage) {
    mapPage.assert.elementPresent('@riskAddressLink')
  },
  assertMapSelectedAndLoaded: function (client, mapPage, mapType) {
    // I'm sure there are prettier ways to do this, but don't have the time, sync would be nice
    // but just giving the browser 3 (500ms, 2000ms, 5000ms) chances to load the layer within the paused values, otherwise took to long

    client.pause(500) // give layer 500ms

    mapPage.getTestData(client, function (result) {
      if (result.isLoading) {
        client.pause(2000)
        mapPage.getTestData(client, function (result) {
          if (result.isLoading) {
            client.pause(5000)
            mapPage.getTestData(client, function (result) {
              mapPage.assert.equal(result.layer.replace('risk:', ''), mapType, 'Assert map layer is loaded (7500ms check!!!)')
            })
          } else {
            mapPage.assert.equal(result.layer.replace('risk:', ''), mapType, 'Assert map layer is loaded (2500ms check)')
          }
        })
      } else {
        mapPage.assert.equal(result.layer.replace('risk:', ''), mapType, 'Assert map layer is loaded (500ms check)')
      }
    })
  },
  assertZoomIs: function (client, mapPage, val) {
    mapPage.getTestData(client, function (result) {
      mapPage.assert.equal(result.zoom, val, 'Assert zoom')
    })
  },
  assertFullscreen: function (mapPage, val) {
    if (val) {
      mapPage.assert.cssClassPresent('@main', 'fullscreen')
    } else {
      mapPage.assert.cssClassNotPresent('@main', 'fullscreen')
    }
  },
  assertCentreIs: function (client, mapPage, point) {
    mapPage.getTestData(client, function (result) {
      mapPage
        .assert.equal(result.point[0], point[0], 'Assert centre')
        .assert.equal(result.point[1], point[1], 'Assert centre')
    })
  },
  assertIsDetailedView: function (mapPage) {
    mapPage
      .assert.cssClassPresent('@mapContainer', 'detailed')
      // Rivers and sea
      .assert.visible('@RiversOrSea_1-ROFRS')
      .assert.visible('@RiversOrSea_2-FWLRSF')
      // Surface water
      .assert.visible('@SurfaceWater_6-SW-Extent')
      .assert.visible('@SurfaceWater_9-SWDH')
      .assert.visible('@SurfaceWater_12-SWVH')
      .assert.visible('@SurfaceWater_8-SWDM')
      .assert.visible('@SurfaceWater_11-SWVM')
      .assert.visible('@SurfaceWater_7-SWDL')
      .assert.visible('@SurfaceWater_10-SWVL')
      // reservoirs
      .assert.visible('@Reservoirs_3-ROFR')
      .assert.visible('@Reservoirs_4-DOFR')
      .assert.visible('@Reservoirs_5-SOFR')
  },
  assertIsBasicView: function (mapPage) {
    mapPage
      .assert.cssClassNotPresent('@mapContainer', 'detailed')
      // Rivers and sea
      .assert.visible('@RiversOrSea_1-ROFRS')
      .assert.hidden('@RiversOrSea_2-FWLRSF')
      // Surface water
      .assert.visible('@SurfaceWater_6-SW-Extent')
      .assert.hidden('@SurfaceWater_9-SWDH')
      .assert.hidden('@SurfaceWater_12-SWVH')
      .assert.hidden('@SurfaceWater_8-SWDM')
      .assert.hidden('@SurfaceWater_11-SWVM')
      .assert.hidden('@SurfaceWater_7-SWDL')
      .assert.hidden('@SurfaceWater_10-SWVL')
      // reservoirs
      .assert.visible('@Reservoirs_3-ROFR')
      .assert.hidden('@Reservoirs_4-DOFR')
      .assert.hidden('@Reservoirs_5-SOFR')
  }
}
