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
      client.assert.containsText('#content main header h1.heading-xlarge', 'Sorry, this service is temporarily unavailable')
      client.assert.containsText('#content main p.lede', 'Thank you for your patience')
      client.assert.containsText('#content main p:not(.lede)', 'Information about all current flood warnings is also available on')
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
      client.assert.containsText('#content main header h1.heading-xlarge', 'Sorry, this service is temporarily unavailable')
      client.assert.containsText('#content main p.lede', 'Thank you for your patience')
      client.assert.containsText('#content main p:not(.lede)', 'Information about all current flood warnings is also available on')
    })

    // Close the window
    client.end()
  }
}
