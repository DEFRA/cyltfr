module.exports = {
  url: function () {
    return this.api.launchUrl + '/search'
  },
  elements: {
    'main': '#search-page',
    'postcodeDisplay': 'form h4.postcode-display',
    'addressList': 'form select#address',
    'submitBtn': 'form button[type=submit]'
  },
  commands: [{
    selectAddress: function (id) {
      return this.click('input[name=uprn][value="' + id + '"]')
    },
    submit: function () {
      return this.waitForElementVisible('@submitBtn', 1000)
        .click('@submitBtn')
    }
  }]
}
