var data = require('./data')
var homeTests = require('../../common/home')
var searchTests = require('../../common/search')

module.exports = {
  'invalid-postcode': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var address = item.address
      var postcode = item.postcode

      /**
       * Create home page object
       */
      var homePage = client.page.home()

      // Navigate to the home page & submit postcode
      homeTests.loadPage(homePage)
      homeTests.setPostcodeAndSubmit(homePage, postcode)

      /**
       * Create search page object
       */
      var searchPage = client.page.search()

      // Assert the correct postcode
      searchTests.assertPostcode(searchPage, postcode)

      // Select the first address and submit
      searchPage.selectAddress(address)
      searchPage.submit()

      // Asset we get the default error message
      homeTests.assertErrorMessage(homePage)
    })

    // Close the window
    client.end()
  }
}
