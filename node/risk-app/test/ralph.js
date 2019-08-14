const wreck = require('@hapi/wreck')
const HttpProxyAgent = require('http-proxy-agent')
const HttpsProxyAgent = require('https-proxy-agent')
const { getProxyForUrl } = require('proxy-from-env')
const http = wreck.defaults({ events: true, timeout: 5000 })

const agents = {}
function getAgentForUrl (proxyUrl, uri, options) {
  if (agents[proxyUrl]) {
    return agents[proxyUrl]
  } else {
    const Agent = uri.protocol === 'https:'
      ? HttpsProxyAgent
      : HttpProxyAgent

    const agent = new Agent(proxyUrl)

    // Cache
    agents[proxyUrl] = agent

    return agent
  }
}

http.events.on('preRequest', (uri, options) => {
  const proxyUrl = getProxyForUrl(uri.href)

  if (proxyUrl) {
    uri.agent = getAgentForUrl(proxyUrl, uri, options)
  }
})

function get (url, options, ext = false) {
  // const thisWreck = (ext && wreckExt) ? wreckExt : wreck

  return http.get(url, options)
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

module.exports = http
