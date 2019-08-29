module.exports = {
  loadPage: function (postcodePage) {
    postcodePage.navigate()
      .assert.title('Long term flood risk information - GOV.UK')
      .assert.containsText('@h1', 'Find an address to check the flood risk')
      // .assert.containsText('@para1', 'Use this service to find out:')
      // .assert.containsText('@list', 'the probability that a location will flood')
      // .assert.containsText('@list', 'the possible causes of flooding')
      // .assert.containsText('@list', 'where to find advice on managing flood risk')
      // .assert.containsText('@para2', 'Enter a property number or name and its postcode to see long term flood risk information for that area.')
      // .assert.containsText('@para3', 'Or view a map showing areas at risk of flooding.')
      // .assert.containsText('@para4', 'This service covers England only.')
      // .assert.containsText('@h3', 'Find the address')
      // .assert.visible('@premisesText')
      .assert.visible('@postcodeText')
  },
  assertErrorMessage: function (postcodePage, errorMessage = 'Enter a full postcode in England') {
    postcodePage.assert.containsText('@errorMessage', errorMessage)
  }
}
