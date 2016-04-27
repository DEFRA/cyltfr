var data = require('./data')
var homeTests = require('../../common/home')

module.exports = {
  'invalid-postcode': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var postcode = item.postcode

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit invalid postcode
      homeTests.loadPage(homePage)
      homePage.setPostcodeAndSubmit(postcode)

      // Asset we get the default error message
      homeTests.assertErrorMessage(homePage)
    })

    // Close the window
    client.end()
  }
}
