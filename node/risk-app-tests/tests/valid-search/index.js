var data = require('./data')
var postcodeTests = require('../../common/postcode')
var addressTests = require('../../common/address')

module.exports = {
  'valid-search': function (client) {
    // Loop over each test case
    data.forEach(function (item) {
      var postcode = item.postcode
      var expectedResultCount = item.expectedResultCount

      /**
       * Create postcode page object
       */
      var postcodePage = client.page.postcode()

      // Navigate to the postcode page & submit postcode
      postcodeTests.loadPage(postcodePage)
      postcodePage.setPostcodeAndSubmit(postcode)

      /**
       * Create address page object
       */
      var addressPage = client.page.address()

      // Assert the correct search page is displayed
      addressTests.assertPage(addressPage, expectedResultCount)
    })

    // Close the window
    client.end()
  }
}
