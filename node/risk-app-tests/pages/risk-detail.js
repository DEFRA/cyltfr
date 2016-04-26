module.exports = {
  elements: {
    'main': '#risk-detail-page',
    'section': '#risk-detail-page .risk',
    'riverAndSeaPanel': '#river-and-sea-panel',
    'surfaceWaterPanel': '#surface-water-panel',
    'reservoirPanel': '#reservoir-panel',
    'additionalInformation': '#additional-information',
    'summaryLink': '#risk-page a[data-id="risk-summary"]'
  },
  commands: [{
    getInfo: function (callback) {
      return this.waitForElementVisible('@main', 5000)
        .getAttribute('@main', 'data-test-info', function (result) {
          var info = JSON.parse(result.value)
          callback(info)
        })
    },
    loadPageWithAddress: function (addressId) {
      var url = this.api.launchUrl + '/risk-detail?address=' + addressId
      return this.api.url(url)
    },
    gotoRiskSummary: function () {
      return this.waitForElementVisible('@summaryLink', 1000)
        .click('@summaryLink')
    }
  }]
}
