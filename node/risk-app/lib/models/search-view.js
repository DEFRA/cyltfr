function SearchViewModel (postcode, addresses, warnings) {
  this.postcode = postcode
  this.addresses = addresses
  this.singleAddressFound = addresses.length === 1
  this.multipleAddressesFound = addresses.length > 1
}

module.exports = SearchViewModel
