var data = require('./data')
var homeTests = require('../../common/home')
var searchTests = require('../../common/search')
var riskTests = require('../../common/risk')
var riskDetailTests = require('../../common/risk-detail')

module.exports = {
  'happy-path': function (client) {
    // Loop over each test case
    data.forEach(function (item) {
      var address = item.address
      var premises = item.premises
      var postcode = item.postcode

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

      // Assert the correct postcode
      searchTests.assertPage(searchPage)

      // Select the first address and submit
      searchPage.selectAddress(address)
      searchPage.submit()

      /**
       * Create risk page object
       */
      var riskPage = client.page.risk()

      // Check outcome
      riskTests.assertOutcome(riskPage, item)

      // Navigate to detail pages
      riskPage.gotoRiskDetail()

      /**
       * Create risk detail page object
       */
      var riskDetailPage = client.page['risk-detail']()

      // Check outcome
      riskDetailTests.assertOutcome(riskDetailPage, item)
    })

    // Close the window
    client.end()
  }
}
