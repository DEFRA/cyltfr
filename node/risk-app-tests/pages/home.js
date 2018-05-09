module.exports = {
  url: function () {
    console.log('2334534346', this.api.launchUrl)
    return this.api.launchUrl
  },
  elements: {
    'main': '#home-page',
    'form': '#home-page form',
    'h1': '.heading-xlarge',
    'para1': '.mission > p:nth-child(2)',
    'list': '.list',
    'para2': '.column-two-thirds > p:nth-child(2)',
    'para3': '.column-two-thirds > p:nth-child(3)',
    'para4': '.column-two-thirds > p:nth-child(4)',
    'h3': '.heading-medium',
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
