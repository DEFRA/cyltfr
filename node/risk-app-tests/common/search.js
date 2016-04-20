module.exports = {
  loadPage: function (searchPage) {
    searchPage.navigate()
      .assert.title('Long Term Flood Risk Information - GOV.UK')
  },
  assertPostcode: function (searchPage, postcode) {
    searchPage.expect.element('@main').to.be.present.after(2000)
    searchPage.expect.element('@postcodeDisplay').to.contain.text(postcode)
  }
}
