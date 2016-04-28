/* global LTFRI*/

module.exports = {
  url: function () {
    return this.api.launchUrl + '/map'
  },
  elements: {
    'main': '#map-page',
    'heading': '#map-page h1',
    'mapContainer': '#map-page .map-container',
    'riskAddressLink': '#map-page a[data-id="risk-address"]',
    'mapSwitch': '#map-page .map-switch a',
    'mobileNav': '.visible-mobile select',
    'zoomIn': 'button.ol-zoom-in',
    'zoomOut': 'button.ol-zoom-out',
    'fullscreen': 'div.ol-full-screen',
    'RiversOrSea': '#map-page li#RiversOrSea',
    'SurfaceWater': '#map-page li#SurfaceWater',
    'Reservoirs': '#map-page li#Reservoirs',
    'RiversOrSea_1-ROFRS': '#map-page li#RiversOrSea_1-ROFRS',
    'RiversOrSea_2-FWLRSF': '#map-page li#RiversOrSea_2-FWLRSF',
    'SurfaceWater_6-SW-Extent': '#map-page li#SurfaceWater_6-SW-Extent',
    'SurfaceWater_9-SWDH': '#map-page li#SurfaceWater_9-SWDH',
    'SurfaceWater_12-SWVH': '#map-page li#SurfaceWater_12-SWVH',
    'SurfaceWater_8-SWDM': '#map-page li#SurfaceWater_8-SWDM',
    'SurfaceWater_11-SWVM': '#map-page li#SurfaceWater_11-SWVM',
    'SurfaceWater_7-SWDL': '#map-page li#SurfaceWater_7-SWDL',
    'SurfaceWater_10-SWVL': '#map-page li#SurfaceWater_10-SWVL',
    'Reservoirs_3-ROFR': '#map-page li#Reservoirs_3-ROFR',
    'Reservoirs_4-DOFR': '#map-page li#Reservoirs_4-DOFR',
    'Reservoirs_5-SOFR': '#map-page li#Reservoirs_5-SOFR'
  },
  commands: [{
    loadPageWithParams: function (addressId, easting, northing, mapType) {
      var url = this.api.launchUrl + '/map?address=' + addressId + '&easting=' + easting + '&northing=' + northing + (mapType ? '&map=' + mapType : '')
      return this.api.url(url)
    }
  }, {
    toggleDetailed: function () {
      return this.waitForElementVisible('@mapSwitch', 2000).click('@mapSwitch')
    }
  }, {
    selectMap: function (ref, isMobile) {
      if (isMobile) {
        return this.waitForElementVisible('@mobileNav', 2000).click('select option[value="' + ref + '"]')
      } else {
        return this.waitForElementVisible('@' + ref, 2000).click('@' + ref)
      }
    }
  }, {
    selectMapMobile: function (ref) {
      return this.waitForElementVisible('@mobileNav', 2000).click('select option[value="' + ref + '"]')
    }
  }, {
    isMobile: function (callback) {
      this.waitForElementVisible('@zoomIn', 10000)
        .isVisible('@mobileNav', function (result) {
          callback(result.value)
        })
    }
  }, {
    zoomIn: function (client, n) {
      var that = this
      this.waitForElementVisible('@zoomIn', 10000, function () {
        while (n > 0) {
          that.click('@zoomIn')
          client.pause(500)
          n--
        }
      })
    }
  }, {
    zoomOut: function (client, n) {
      var that = this
      this.waitForElementVisible('@zoomOut', 10000, function () {
        while (n > 0) {
          that.click('@zoomOut')
          client.pause(500)
          n--
        }
      })
    }
  }, {
    toggleFullscreen: function () {
      var that = this
      this.waitForElementVisible('@fullscreen', 10000, function () {
        that.click('@fullscreen')
      })
    }
  }, {
    getTestData: function (client, callback) {
      client.execute(function () {
        return LTFRI.MapPage.testValues()
      }, function (result) {
        callback(result.value)
      })
    }
  }]
}
