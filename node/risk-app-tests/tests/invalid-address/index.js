var data = require('./data')
var riskTests = require('../../common/risk')
var riskDetailTests = require('../../common/risk-detail')

module.exports = {
  'invalid-address-risk': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var address = item.address

      /**
       * Create home page object
       */
      var riskPage = client.page.risk()

      // Navigate to the risk page with an invalid addressId
      riskTests.loadPage(riskPage, address)

      // Assert we're on the error page
      riskTests.assertError(riskPage)
    })

    // Close the window
    client.end()
  },
  'invalid-address-risk-detail': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var address = item.address

      /**
       * Create home page object
       */
      var riskDetailPage = client.page['risk-detail']()

      // Navigate to the risk page with an invalid addressId
      riskDetailTests.loadPage(riskDetailPage, address)

      // Assert we're on the error page
      riskDetailTests.assertError(riskDetailPage)
    })

    // Close the window
    client.end()
  }
}
