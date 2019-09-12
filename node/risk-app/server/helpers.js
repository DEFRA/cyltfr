const util = require('./util')

function formatDate (value, format) {
  if (typeof format === 'string') {
    return util.formatDate(value, format)
  } else {
    return util.formatDate(value)
  }
}

const postcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i

module.exports = {
  formatDate: formatDate,
  postcodeRegex: postcodeRegex
}
