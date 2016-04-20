module.exports = {
  loadPage: function (riskPage) {
    riskPage.navigate()
      .assert.title('Long Term Flood Risk Information - GOV.UK')
  },
  assertOutcome: function (riskPage, outcome) {
    riskPage.getStatus(function (status) {
      riskPage.assert.equal(status, outcome)
    })
  }
}
