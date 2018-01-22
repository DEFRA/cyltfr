module.exports = {
  loadPage: function (searchPage) {
    searchPage.navigate()
      .assert.title('Long term flood risk assessment for locations in England - GOV.UK')
  },
  assertPage: function (searchPage, resultCount) {
    searchPage.expect.element('@main').to.be.present.after(2000)

    if (typeof resultCount === 'number') {
      searchPage.api.elements('css selector', 'form > div .multiple-choice', function (result) {
        searchPage.assert.equal(result.value.length, resultCount)
      })
    }
  }
}
