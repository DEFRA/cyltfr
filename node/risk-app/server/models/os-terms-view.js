const moment = require('moment')

function OsViewModel (errorCode) {
  this.year = moment(Date.now()).format('YYYY')
}

module.exports = OsViewModel
