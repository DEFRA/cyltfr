module.exports = {
  url: function () {
    return this.api.launchUrl
  },
  elements: {
    'main': '#home-page',
    'form': '#home-page form',
    'postcodeText': '#postcode',
    'submitBtn': '#home-page form button[type=submit]',
    'errorMessage': '#home-page form .error-message'
  },
  commands: [{
    setPostcode: function (value) {
      return this.setValue('@postcodeText', value)
    },
    getErrorMessage: function () {
      return this.waitForElementVisible('@errorMessage', 1000)
        .click('@submitBtn')
    },
    submit: function () {
      return this.waitForElementVisible('@submitBtn', 1000)
        .click('@submitBtn')
    }
  }]
}
