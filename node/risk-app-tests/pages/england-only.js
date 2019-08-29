module.exports = {
  url: function () {
    return this.api.launchUrl + '/england'
  },
  elements: {
    'main': '#england-only-page',
    'heading': '.govuk-heading-xl'
  }
}
