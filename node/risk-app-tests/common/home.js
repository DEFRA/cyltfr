module.exports = {
  loadPage: function (homePage) {
    homePage.navigate()
      .assert.title('Long Term Flood Risk Information - GOV.UK')
      .assert.visible('@postcodeText')
  },
  setPostcodeAndSubmit: function (homePage, postcode) {
    homePage
      .setPostcode(postcode)
      .submit()
  },
  assertErrorMessage: function (homePage, errorMessage) {
    if (!errorMessage) {
      errorMessage = 'Please enter a valid postcode in England'
    }

    homePage.assert.containsText('@errorMessage', errorMessage)
  }
}
