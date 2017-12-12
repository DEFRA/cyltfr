var data = require('./data')
var homeTests = require('../../common/home')

module.exports = {
  'invalid-premises': function (client) {
    // Loop over each item
    data.forEach(function (item) {
      var premises = item.premises
      var postcode = item.postcode

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit invalid premise
      homeTests.loadPage(homePage)
      homePage.setPremisesAndPostcodeAndSubmit(premises, postcode)

      // Asset we get the default error message
      homeTests.assertErrorMessage(homePage, 'You need to give a house number or name')
    })

    // Close the window
    client.end()
  }
}
