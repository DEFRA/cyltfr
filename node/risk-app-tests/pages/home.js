module.exports = {
  url: function () {
    return this.api.launchUrl
  },
  elements: {
    'main': '#home-page',
    'form': 'form',
    'postcodeText': 'form #postcode',
    'submitBtn': 'form button[type=submit]'
  },
  commands: [{
    setPostcode: function (value) {
      return this.setValue('@postcodeText', value)
    },
    submit: function () {
      return this.waitForElementVisible('@submitBtn', 1000)
        .click('@submitBtn')
    }
  }]
}
