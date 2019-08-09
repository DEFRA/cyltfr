process.env.HTTP_PROXY = 'http://ip-10-64-66-34.eu-west-2.compute.internal:8090'

const wreck = require('@hapi/wreck')
const HttpProxyAgent = require('http-proxy-agent')
const HttpsProxyAgent = require('https-proxy-agent')

function getEnv (key) {
  return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || ''
}

const HTTP_PROXY = getEnv('HTTP_PROXY')
const HTTPS_PROXY = getEnv('HTTPS_PROXY')
const agents = Object.assign({}, wreck.agents)

if (HTTP_PROXY || HTTPS_PROXY) {
  if (HTTP_PROXY) {
    agents.http = new HttpProxyAgent(HTTP_PROXY)
  }

  if (HTTPS_PROXY) {
    agents.https = new HttpsProxyAgent(HTTPS_PROXY)
  }
}

const http = wreck.defaults({ agents })
const { getProxyForUrl } = require('proxy-from-env')
const url = getProxyForUrl('http://localhost:8050/floodrisk/364924/373250/20')

console.log(url)
http.get('http://localhost:8050/floodrisk/364924/373250/20', { json: true })
  .then(response => {
    if (response.res.statusCode !== 200) {
      throw new Error('Requested resource returned a non 200 status code')
    }

    console.log(response.payload)
    return response.payload
  })
  .catch(err => {
    console.log(err)
  })
