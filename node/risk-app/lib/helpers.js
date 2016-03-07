var util = require('./util')

function is (value, test, options) {
  if (value === test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function isnt (value, test, options) {
  if (value !== test) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}

function formatDate (value, format) {
  if (typeof format === 'string') {
    return util.formatDate(value, format)
  } else {
    return util.formatDate(value)
  }
}

module.exports = {
  is: is,
  isnt: isnt,
  formatDate: formatDate
}
