const moment = require('moment')

function SearchViewModel (postcode, addresses, errors) {
  this.postcode = postcode
  this.addresses = addresses

  if (addresses) {
    this.numAddressesFound = addresses.length
  }

  if (errors) {
    this.errors = {
      uprn: 'You need to select the address'
    }
  }

  this.year = moment(Date.now()).format('YYYY')

  // In the event of a validation error, save
  // a lookup to address service again by smuggling
  // the address results in a JSON encoded form field
  this.addressesJSON = JSON.stringify(addresses)
}

module.exports = SearchViewModel
