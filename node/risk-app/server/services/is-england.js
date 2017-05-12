var config = require('../../config').service
var util = require('../util')
var protocol = config.protocol
var host = config.host
var port = config.port
var urlBase = protocol + '://' + host + ':' + port

module.exports = {
  getIsEngland: function (easting, northing, callback) {
    var url = urlBase + '/is-england/' + easting + '/' + northing
    return util.getJson(url, callback)
  }
}
