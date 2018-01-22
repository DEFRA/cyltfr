var data = require('./data')
var homeTests = require('../../common/home')
var englandOnlyTests = require('../../common/england-only')

module.exports = {
  'welsh-address': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var premises = item.premises
      var postcode = item.postcode

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit premise & postcode
      homeTests.loadPage(homePage)
      homePage.setPremisesAndPostcodeAndSubmit(premises, postcode)

      /**
       * Create search page object
       */
      var englandOnlyPage = client.page['england-only']()

      // Assert we get the correct regional message
      englandOnlyTests.assertMessage(englandOnlyPage, 'wales')
    })

    // Close the window
    client.end()
  }
}
