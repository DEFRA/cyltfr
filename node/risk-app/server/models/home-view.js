const moment = require('moment')

function HomeViewModel (premises, postcode, errors) {
  this.noIndex = false
  this.premises = premises
  this.postcode = postcode

  // Validation messages
  if (errors) {
    this.noIndex = true
    this.errors = {}

    // Form level errors
    const formErrors = errors.find(e => e.path.includes('address'))
    if (formErrors) {
      this.errors.address = formErrors.message
    }

    // Premises
    const premisesErrors = errors.find(e => e.path.includes('premises'))
    if (premisesErrors) {
      this.errors.premises = 'You need to give a property number or name'
    }

    // Postcode
    const postcodeErrors = errors.find(e => e.path.includes('postcode'))
    if (postcodeErrors) {
      this.errors.postcode = 'You need to give a full postcode'
    }
  }

  this.year = moment(Date.now()).format('YYYY')
  this.pageTitle = 'Long term flood risk assessment for locations in England - GOV.UK'
}

module.exports = HomeViewModel
