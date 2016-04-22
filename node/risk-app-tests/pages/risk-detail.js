module.exports = {
  elements: {
    'main': '#risk-detail-page',
    'section': '#risk-detail-page .risk'
  },
  commands: [{
    getStatus: function (callback) {
      this.getAttribute('@main', 'data-test-info', function (result) {
        callback(result.value)
      })
    },
    loadPageWithAddress: function (addressId) {
      var url = this.api.launchUrl + '/risk-detail?address=' + addressId
      return this.api.url(url)
    }
  }]
}
