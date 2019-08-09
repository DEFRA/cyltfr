// process.env.HTTP_PROXY = 'http://localhost:8090'

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

module.exports = http

// http.get('http://localhost:8050/floodrisk/364924/373250/20', { json: true, agent: false })
//   .then(response => {
//     if (response.res.statusCode !== 200) {
//       throw new Error('Requested resource returned a non 200 status code')
//     }

//     console.log(response.payload)
//     return response.payload
//   })
//   .catch(err => {
//     console.log(err)
//   })
