var errorCodes = {
  postcode: 'Please enter a valid postcode in England'
}

function HomeViewModel (errorCode) {
  this.errorMessage = errorCode
    ? (errorCodes[errorCode] || 'Unknown error')
    : ''

  this.hasErrorMessage = !!errorCode
}

module.exports = HomeViewModel
