var data = require('./data')
var postcodeTests = require('../../common/postcode')
var addressTests = require('../../common/address')
var riskTests = require('../../common/risk')

module.exports = {
  'groundwater': function (client) {
    // Loop over each postcode
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
      // TODO assertOutcome from old risk-detail pages (assertOutcomeGW) too
      riskTests.assertOutcomeGW(riskPage, item)

      // Navigate to detail pages
      // riskPage.gotoRiskDetail()

      // /**
      //  * Create risk detail page object
      //  */
      // var riskDetailPage = client.page['risk-detail']()

      // // Check outcome
      // riskDetailTests.assertOutcomeGW(riskDetailPage, item)
    })

    // Close the window
    client.end()
  }
}
