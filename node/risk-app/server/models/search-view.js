const moment = require('moment')

function SearchViewModel (premises, postcode, addresses, errors) {
  this.premises = premises
  this.postcode = postcode
  this.addresses = addresses

  if (addresses) {
    if (addresses.length === 1) {
      this.singleAddress = addresses[0]
    } else {
      this.numAddressesFound = addresses.length
    }
  }

  if (errors) {
    this.errors = {
      uprn: `You need to ${this.singleAddress ? 'confirm' : 'select'} the address`
    }
  }

  this.year = moment(Date.now()).format('YYYY')

  // In the event of a validation error, save
  // a lookup to address service again by smuggling
  // the address results in a JSON encoded form field
  this.addressesJSON = JSON.stringify(addresses)
}

module.exports = SearchViewModel
