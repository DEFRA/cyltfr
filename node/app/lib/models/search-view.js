function SearchViewModel (addresses) {
  this.postcode = addresses[0].POSTCODE
  this.addresses = addresses
  this.singleAddressFound = addresses.length === 1
  this.multipleAddressesFound = addresses.length > 1
}

module.exports = SearchViewModel
