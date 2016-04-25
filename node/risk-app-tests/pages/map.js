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
    'RiversOrSea': '#map-page li#RiversOrSea',
    'SurfaceWater': '#map-page li#SurfaceWater',
    'Reservoirs': '#map-page li#Reservoirs'
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
    selectMap: function (ref) {
      return this.waitForElementVisible('@' + ref, 2000).click('@' + ref)
    }
  }]
}
