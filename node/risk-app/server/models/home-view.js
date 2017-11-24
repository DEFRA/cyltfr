var moment = require('moment')
// var errorCodes = {

//   postcode: 'Please enter a valid postcode in England'
// }

function HomeViewModel (premises, postcode, errors) {
  this.premises = premises
  this.postcode = postcode

  // Validation messages
  if (errors) {
    this.errors = {}

    // Form level errors
    var formErrors = errors.find(e => e.path === 'address')
    if (formErrors) {
      this.errors.address = formErrors.message
    }

    // Premises
    var premisesErrors = errors.find(e => e.path === 'premises')
    if (premisesErrors) {
      this.errors.premises = 'You need to give a house number or name'
    }

    // Postcode
    var postcodeErrors = errors.find(e => e.path === 'postcode')
    if (postcodeErrors) {
      this.errors.postcode = 'You need to give a full postcode'
    }
  }

  this.year = moment(Date.now()).format('YYYY')
  this.pageTitle = 'Long term flood risk assessment for locations in England - GOV.UK'
}

module.exports = HomeViewModel
