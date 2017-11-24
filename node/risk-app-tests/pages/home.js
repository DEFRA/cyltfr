module.exports = {
  url: function () {
    console.log('2334534346', this.api.launchUrl)
    return this.api.launchUrl
  },
  elements: {
    'main': '#home-page',
    'form': '#home-page form',
    'premisesText': '#premises',
    'postcodeText': '#postcode',
    'submitBtn': '#home-page form button[type=submit]',
    'errorMessage': '#home-page .error-summary'
  },
  commands: [{
    setPremises: function (value) {
      return this.setValue('@premisesText', value)
    },
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
    },
    setPremisesAndPostcodeAndSubmit: function (premises, postcode) {
      return this
        .setPremises(premises)
        .setPostcode(postcode)
        .submit()
    }
  }]
}
