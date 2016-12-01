var config = require('../../config')
var floodWarningsUrl = config.floodWarningsUrl
var agent = null
if (process.env.http_proxy) {
  var HTTPProxyAgent = require('http-proxy-agent')
  var proxy = process.env.http_proxy
  agent = new HTTPProxyAgent(proxy)
}
var wreck = require('wreck').defaults({
  agent: agent,
  timeout: config.httpTimeoutMs
})

function findWarnings (location, callback) {
  var url = floodWarningsUrl + '/api/warnings?location=' + location
  wreck.get(url, { json: true }, function (err, response, payload) {
    if (err || response.statusCode !== 200) {
      return callback(err || payload || new Error('Unknown error'))
    }
    callback(null, payload)
  })
}

module.exports = {
  findWarnings: findWarnings
}
