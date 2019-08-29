var addressTests = require('../../common/address')

module.exports = {
  'no-selection': function (client) {
    /**
     * Create address page object
     */
    var addressPage = client.page.address()

    // Navigate to the postcode page & submit postcode
    addressPage.loadPageWithPostcode('WA14 1EP')
    addressPage.submit()

    // Assert we get the default error message
    addressTests.assertErrorMessage(addressPage)

    // Close the window
    client.end()
  }
}
