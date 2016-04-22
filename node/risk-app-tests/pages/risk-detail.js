module.exports = {
  elements: {
    'main': '#risk-detail-page',
    'section': '#risk-detail-page .risk'
  },
  commands: [{
    getInfo: function (callback) {
      this.getAttribute('@main', 'data-test-info', function (result) {
        var info = JSON.parse(result.value)
        callback(info)
      })
    },
    loadPageWithAddress: function (addressId) {
      var url = this.api.launchUrl + '/risk-detail?address=' + addressId
      return this.api.url(url)
    }
  }]
}
