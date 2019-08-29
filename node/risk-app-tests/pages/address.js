module.exports = {
  url: function () {
    return this.api.launchUrl + '/address'
  },
  elements: {
    'main': '#address-page',
    'form': '#address-page form',
    'h1': '.govuk-heading-xl',
    'addressSelect': '#address',
    'defaultOption': '#address option:nth-child(1)',
    'submitBtn': '#address-page form button[type=submit]',
    'errorMessage': '#address-page #address-error'
  },
  commands: [{
    loadPageWithPostcode: function (addressId) {
      var url = this.url() + '?postcode=' + addressId
      return this.api.url(url)
    },
    setAddress: function (value) {
      return this.click('select#address option[value="' + value + '"]')
    },
    getErrorMessage: function () {
      return this.waitForElementVisible('@errorMessage', 1000)
        .click('@submitBtn')
    },
    submit: function () {
      return this.waitForElementVisible('@submitBtn', 1000)
        .click('@submitBtn')
    },
    setAddressAndSubmit: function (address) {
      return this
        .setAddress(address)
        .submit()
    }
  }]
}
