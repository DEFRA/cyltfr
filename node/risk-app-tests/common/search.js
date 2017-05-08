module.exports = {
  loadPage: function (searchPage) {
    searchPage.navigate()
      .assert.title('Long term flood risk assessment for locations in England - GOV.UK')
  },
  assertPostcode: function (searchPage, postcode) {
    searchPage.expect.element('@main').to.be.present.after(2000)
    searchPage.expect.element('@postcodeDisplay').to.contain.text(postcode)
  }
}
