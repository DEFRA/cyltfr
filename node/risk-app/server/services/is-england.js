const config = require('../../config').service
const util = require('../util')
const protocol = config.protocol
const host = config.host
const port = config.port
const urlBase = protocol + '://' + host + ':' + port

module.exports = {
  getIsEngland: function (easting, northing) {
    const url = urlBase + '/is-england/' + easting + '/' + northing
    return util.getJson(url)
  }
}
