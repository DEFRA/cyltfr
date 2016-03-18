var config = require('../../config')
var floodWarningsUrl = config.floodWarningsUrl

function SearchViewModel (postcode, addresses, warnings) {
  this.postcode = postcode
  this.addresses = addresses
  this.singleAddressFound = addresses.length === 1
  this.multipleAddressesFound = addresses.length > 1
  if (warnings && warnings.message) {
    if (warnings.severity) {
      var summary = warnings.summary[warnings.severity - 1]
      this.banner = {
        url: floodWarningsUrl + '/warnings?location=' + postcode,
        message: warnings.message.replace('at this location', 'for this postcode'),
        className: summary.severity === 3 ? 'alert' : 'warning',
        icon: summary.hash
      }
    } else {
      this.banner = {
        message: warnings.message.replace('at this location', 'for this postcode')
      }
    }
  }
  this.warnings = warnings
}

module.exports = SearchViewModel
