class HomeViewModel {
  constructor (postcode, errorMessage) {
    this.postcodeInput = {
      label: {
        text: 'Postcode'
      },
      id: 'postcode',
      value: postcode,
      name: 'postcode',
      classes: 'govuk-input--width-10',
      hint: {
        text: 'Enter a full postcode in England'
      }
    }

    if (errorMessage) {
      this.postcodeInput.errorMessage = {
        text: errorMessage
      }
    }
  }
}

module.exports = HomeViewModel
