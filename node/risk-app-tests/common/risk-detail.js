module.exports = {
  loadPage: function (riskPage, addressId) {
    riskPage.loadPageWithAddress(addressId)
      .assert.title('Long Term Flood Risk Information - GOV.UK')
  },
  assertOutcome: function (riskPage, outcome) {
    riskPage.getStatus(function (status) {
      riskPage.assert.equal(status, outcome)
    })
  }
}
