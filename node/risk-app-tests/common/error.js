module.exports = {
  assertError: function (page) {
    page.assert.containsText('#main-content .govuk-heading-xl', 'Sorry, there is a problem with the service')
    page.assert.containsText('#main-content .govuk-body', 'Thank you for your patience')
    // page.assert.containsText('#main-content .govuk-body', 'Information about long term flood risk is available on')
  }
}
