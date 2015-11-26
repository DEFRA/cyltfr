function HomeViewModel (errorMessage) {
  this.errorMessage = errorMessage
  this.hasErrorMessage = !!errorMessage
}

module.exports = HomeViewModel
