var data = require('./data')
var homeTests = require('../../common/home')

module.exports = {
  'invalid-postcode': function (client) {
    // Loop over each item
    data.forEach(function (item) {
      var premises = item.premises
      var postcode = item.postcode

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit invalid premise & postcode
      homeTests.loadPage(homePage)
      homePage.setPremisesAndPostcodeAndSubmit(premises, postcode)

      // Asset we get the default error message
      homeTests.assertErrorMessage(homePage, 'You need to give a full postcode')
    })

    // Close the window
    client.end()
  }
}
