var config = require('../../config')
var floodWarningsUrl = config.floodWarningsUrl

function BannerViewModel (postcode, warnings) {
  if (warnings && warnings.message) {
    if (warnings.severity) {
      var summary = warnings.summary[warnings.severity - 1]
      this.banner = {
        url: floodWarningsUrl + '/warnings?location=' + postcode,
        message: warnings.message.replace('at this location', 'for this postcode'),
        className: summary.severity === 3 ? 'alert' : 'warning',
        icon: summary.hash
      }
    }
  }
}

module.exports = BannerViewModel
