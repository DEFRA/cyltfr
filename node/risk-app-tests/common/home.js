module.exports = {
  loadPage: function (homePage) {
    homePage.navigate()
      .assert.title('Long term flood risk assessment for locations in England - GOV.UK')
      .assert.visible('@premisesText')
      .assert.visible('@postcodeText')
  },
  assertErrorMessage: function (homePage, errorMessage) {
    if (!errorMessage) {
      errorMessage = 'Please enter a valid postcode in England'
    }
    homePage.assert.containsText('@errorMessage', errorMessage)
  }
}
