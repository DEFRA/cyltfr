module.exports = {
  url: function () {
    return this.api.launchUrl + '/postcode'
  },
  elements: {
    'main': '#postcode-page',
    'form': '#postcode-page form',
    'h1': '.govuk-heading-xl',
    'postcodeText': '#postcode',
    'submitBtn': '#postcode-page form button[type=submit]',
    'errorMessage': '#postcode-page #postcode-error'
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
    },
    setPostcodeAndSubmit: function (postcode) {
      return this
        .setPostcode(postcode)
        .submit()
    }
  }]
}
