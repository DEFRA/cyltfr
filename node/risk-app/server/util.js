var moment = require('moment')
var config = require('../config')
var wreck = require('wreck').defaults({
  timeout: config.httpTimeoutMs
})

function getJson (url, callback) {
  wreck.get(url, { json: true }, function (err, response, payload) {
    if (err || response.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }
    callback(null, payload)
  })
}

function formatDate (value, format) {
  if (typeof format === 'undefined') {
    format = 'h:mma dddd DD MMMM YYYY'
  }
  return moment(value).format(format)
}

function convertLocationToNGR (location) {
  var splitLocation = location.split(',')
  var east = splitLocation[0]
  var north = splitLocation[1]
  var eX = east / 500000
  var nX = north / 500000
  var tmp = Math.floor(eX) - 5.0 * Math.floor(nX) + 17.0
  nX = 5 * (nX - Math.floor(nX))
  eX = 20 - 5.0 * Math.floor(nX) + Math.floor(5.0 * (eX - Math.floor(eX)))
  if (eX > 7.5) {
    eX = eX + 1 // I is not used
  }
  if (tmp > 7.5) {
    tmp = tmp + 1 // I is not used
  }
  var eing = east - (Math.floor(east / 100000) * 100000)
  var ning = north - (Math.floor(north / 100000) * 100000)
  var estr = eing.toFixed(0)
  var nstr = ning.toFixed(0)
  while (estr.length < 5) {
    estr = '0' + estr
  }
  while (nstr.length < 5) {
    nstr = '0' + nstr
  }
  var ngr = String.fromCharCode(tmp + 65) +
            String.fromCharCode(eX + 65) +
            estr + nstr
  return ngr
}

module.exports = {
  getJson: getJson,
  formatDate: formatDate,
  convertLocationToNGR: convertLocationToNGR
}
