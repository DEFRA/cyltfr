module.exports = {
  'Test homepage': function (browser) {
    browser
      .url('http://localhost:3001')
      .waitForElementVisible('body', 1000)
      .setValue('#postcode', 'WA4 1HT')
      .submitForm('form[action="/search"]')
      .pause(1000)
      .assert.containsText('.heading-small.postcode-display', 'WA4 1HT')
      .end()
  }
}
