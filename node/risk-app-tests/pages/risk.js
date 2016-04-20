module.exports = {
  elements: {
    'main': '#risk-page',
    'section': '#risk-page .risk',
    'orderedList': '#risk-page ol.list-number'
  },
  commands: [{
    getStatus: function (callback) {
      var self = this
      this.getAttribute('@main', 'data-test-info', function (result) {
        callback.call(self, result.value)
      })
    },
    submit: function () {
      return this.waitForElementVisible('@submitBtn', 1000)
        .click('@submitBtn')
    }
  }]
}
