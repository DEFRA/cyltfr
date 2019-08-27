const moment = require('moment-timezone')
const HttpsProxyAgent = require('https-proxy-agent')
const config = require('./config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.httpTimeoutMs
})
let wreckExt

if (config.http_proxy) {
  wreckExt = require('@hapi/wreck').defaults({
    timeout: config.httpTimeoutMs,
    agent: new HttpsProxyAgent(config.http_proxy)
  })
}

function get (url, options, ext = false) {
  const thisWreck = (ext && wreckExt) ? wreckExt : wreck

  return thisWreck.get(url, options)
    .then(response => {
      if (response.res.statusCode !== 200) {
        throw new Error('Requested resource returned a non 200 status code')
      }
      return response.payload
    })
}

function getJson (url, ext = false) {
  return get(url, { json: true }, ext)
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

function formatUTCDate (str) {
  return moment.utc(str).tz('Europe/London').format('DD/MM/YYYY h:mma')
}

module.exports = {
  get,
  getJson,
  formatUTCDate,
  cleanseLocation,
  convertLocationToNGR
}
