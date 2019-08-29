var data = require('./data')
var homeTests = require('../../common/home')
var postcodeTests = require('../../common/postcode')
var addressTests = require('../../common/address')
var searchTests = require('../../common/search')
var riskTests = require('../../common/risk')
var riskDetailTests = require('../../common/risk-detail')

module.exports = {
  'happy-path': function (client) {
    // Loop over each test case
    data.forEach(function (item) {
      var address = item.address
      var postcode = item.postcode

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

      // // Assert the correct postcode
      addressTests.assertPage(addressPage)

      // Select the first address and submit
      addressPage.setAddressAndSubmit(address)
      // addressPage.submit()

      /**
       * Create risk page object
       */
      var riskPage = client.page.risk()

      // Check outcome
      // TODO assertOutcome from old risk-detail pages too
      riskTests.assertOutcome(riskPage, item)

      // // Navigate to detail pages
      // riskPage.gotoRiskDetail()

      // /**
      //  * Create risk detail page object
      //  */
      // var riskDetailPage = client.page['risk-detail']()

      // // Check outcome
      // riskDetailTests.assertOutcome(riskDetailPage, item)
    })

    // Close the window
    client.end()
  }
}
