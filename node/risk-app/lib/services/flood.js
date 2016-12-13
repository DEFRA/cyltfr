var util = require('../util')
var config = require('../../config')
var floodWarningsUrl = config.floodWarningsUrl

function findWarnings (location, callback) {
  var url = floodWarningsUrl + '/api/warnings?location=' + location
  util.getJson(url, callback)
}

module.exports = {
  findWarnings: findWarnings
}
