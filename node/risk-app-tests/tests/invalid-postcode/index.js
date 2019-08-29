var data = require('./data')
var postcodeTests = require('../../common/postcode')

module.exports = {
  'invalid-postcode': function (client) {
    // Loop over each item
    data.forEach(function (item) {
      var postcode = item.postcode

      /**
       * Create postcode page object
       */
      var postcodePage = client.page.postcode()

      // Navigate to the postcode page & submit postcode
      postcodeTests.loadPage(postcodePage)
      postcodePage.setPostcodeAndSubmit(postcode)

      // Assert we get the default error message
      postcodeTests.assertErrorMessage(postcodePage)
    })

    // Close the window
    client.end()
  }
}
