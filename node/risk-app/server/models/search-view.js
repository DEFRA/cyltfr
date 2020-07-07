const config = require('../config')
const floodWarningsUrl = config.floodWarningsUrl

class SearchViewModel {
  constructor (postcode, addresses = [], errorMessage, warnings) {
    this.postcode = postcode

    const defaultOption = {
      text: addresses.length === 1
        ? '1 address found'
        : `${addresses.length} addresses found`
    }

    const items = [defaultOption].concat(addresses.map((addr, index) => ({
      text: addr.address,
      value: index
    })))

    this.addressSelect = {
      id: 'address',
      name: 'address',
      label: {
        text: 'Select an address'
      },
      items
    }

    if (warnings && warnings.message) {
      if (warnings.severity && warnings.severity < 4) {
        const summary = warnings.summary[warnings.severity - 1]
        this.banner = {
          url: floodWarningsUrl + '/warnings?location=' + postcode,
          message: warnings.message,
          className: summary.severity === 3 ? 'alert' : 'warning',
          icon: summary.hash
        }
      }
    }

    if (errorMessage) {
      this.addressSelect.errorMessage = {
        text: errorMessage
      }
    }

    this.addresses = JSON.stringify(addresses)
  }
}

module.exports = SearchViewModel
