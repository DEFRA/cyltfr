module.exports = {
  assertError: function (page) {
    page.assert.containsText('#content main header h1.heading-xlarge', 'Sorry, this service is temporarily unavailable')
    page.assert.containsText('#content main p.lede', 'Thank you for your patience')
    page.assert.containsText('#content main p:not(.lede)', 'Information about long term flood risk is available on')
  }
}
