var data = require('./data')
var postcodeTests = require('../../common/postcode')
var englandOnlyTests = require('../../common/england-only')

module.exports = {
  'welsh-postcode': function (client) {
    // Loop over each postcode
    data.forEach(function (item) {
      var postcode = item.postcode

      /**
       * Create postcode page object
       */
      var postcodePage = client.page.postcode()

      // Navigate to the postcode page & submit postcode
      postcodeTests.loadPage(postcodePage)
      postcodePage.setPostcodeAndSubmit(postcode)

      /**
       * Create search page object
       */
      var englandOnlyPage = client.page['england-only']()

      // Assert we get the correct regional message
      englandOnlyTests.assertMessage(englandOnlyPage, 'Wales')
    })

    // Close the window
    client.end()
  }
}
