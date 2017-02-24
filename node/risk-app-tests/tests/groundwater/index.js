var data = require('./data')
var homeTests = require('../../common/home')
var searchTests = require('../../common/search')
var riskTests = require('../../common/risk')
var riskDetailTests = require('../../common/risk-detail')

module.exports = {
  'happy-path': function (client) {
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
      homePage.setPostcodeAndSubmit(postcode)

      /**
       * Create search page object
       */
      var searchPage = client.page.search()

      // Assert the correct postcode
      searchTests.assertPostcode(searchPage, postcode)

      // Select the first address and submit
      searchPage.selectAddress(address)
      searchPage.submit()

      /**
       * Create risk page object
       */
      var riskPage = client.page.risk()

      // Check outcome
      riskTests.assertOutcomeGW(riskPage, item)

      // Navigate to detail pages
      riskPage.gotoRiskDetail()

      /**
       * Create risk detail page object
       */
      var riskDetailPage = client.page['risk-detail']()

      // Check outcome
      riskDetailTests.assertOutcomeGW(riskDetailPage, item)
    })

    // Close the window
    client.end()
  }
}
