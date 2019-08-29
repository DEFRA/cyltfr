var data = require('./data')
var riskTests = require('../../common/risk')
var errorTests = require('../../common/error')

module.exports = {
  'invalid-address-format': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var address = item.address

      /**
       * Create risk page object
       */
      var riskPage = client.page.risk()

      // Navigate to the risk page with an invalid addressId
      riskTests.loadPage(riskPage, address)

      // Assert we're on the error page
      errorTests.assertError(riskPage)
    })

    // Close the window
    client.end()
  }
}
