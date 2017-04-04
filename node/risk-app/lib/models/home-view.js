var moment = require('moment')
var errorCodes = {
  postcode: 'Please enter a valid postcode in England'
}

function HomeViewModel (query) {
  var postcode = query.postcode
  var errorCode = query.err

  this.postcode = postcode
  this.errorMessage = errorCode ? (errorCodes[errorCode] || 'Unknown error') : ''
  this.year = moment(Date.now()).format('YYYY')
  this.hasErrorMessage = !!errorCode
}

module.exports = HomeViewModel
