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
  }
}
