const moment = require('moment')
const config = require('../config')
const wreck = require('wreck').defaults({
  timeout: config.httpTimeoutMs
})

function get (url, options) {
  return wreck.get(url, options)
    .then(response => {
      if (response.res.statusCode !== 200) {
        throw new Error('Requested resource returned a non 200 status code')
      }
      return response.payload
    })
}

function getJson (url) {
  return get(url, { json: true })
}

function formatDate (value, format) {
  if (typeof format === 'undefined') {
    format = 'h:mma dddd DD MMMM YYYY'
  }
  return moment(value).format(format)
}

function cleanseLocation (location) {
  if (location) {
    return location.replace(/[^a-zA-Z0-9',-.& ]/g, '')
  }
}

function convertLocationToNGR (location) {
  const splitLocation = location.split(',')
  const east = splitLocation[0]
  const north = splitLocation[1]
  let eX = east / 500000
  let nX = north / 500000
  let tmp = Math.floor(eX) - 5.0 * Math.floor(nX) + 17.0
  nX = 5 * (nX - Math.floor(nX))
  eX = 20 - 5.0 * Math.floor(nX) + Math.floor(5.0 * (eX - Math.floor(eX)))
  if (eX > 7.5) {
    eX = eX + 1 // I is not used
  }
  if (tmp > 7.5) {
    tmp = tmp + 1 // I is not used
  }
  const eing = east - (Math.floor(east / 100000) * 100000)
  const ning = north - (Math.floor(north / 100000) * 100000)
  let estr = eing.toFixed(0)
  let nstr = ning.toFixed(0)
  while (estr.length < 5) {
    estr = '0' + estr
  }
  while (nstr.length < 5) {
    nstr = '0' + nstr
  }
  const ngr = String.fromCharCode(tmp + 65) +
            String.fromCharCode(eX + 65) +
            estr + nstr
  return ngr
}

module.exports = {
  get: get,
  getJson: getJson,
  formatDate: formatDate,
  cleanseLocation: cleanseLocation,
  convertLocationToNGR: convertLocationToNGR
}
