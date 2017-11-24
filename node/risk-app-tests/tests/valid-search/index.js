var data = require('./data')
var homeTests = require('../../common/home')
var searchTests = require('../../common/search')

module.exports = {
  'valid-search': function (client) {
    // Loop over each test case
    data.forEach(function (item) {
      var premises = item.premises
      var postcode = item.postcode
      var expectedResultCount = item.expectedResultCount

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit premises & postcode
      homeTests.loadPage(homePage)
      homePage.setPremisesAndPostcodeAndSubmit(premises, postcode)

      /**
       * Create search page object
       */
      var searchPage = client.page.search()

      // Assert the correct search page is displayed
      searchTests.assertPage(searchPage, expectedResultCount)
    })

    // Close the window
    client.end()
  }
}
