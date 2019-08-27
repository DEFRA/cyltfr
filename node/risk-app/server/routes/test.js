const sprintf = require('sprintf-js')
const { getProxyForUrl } = require('proxy-from-env')
const HttpsProxyAgent = require('https-proxy-agent')
const config = require('../config').ordnanceSurvey
const findByIdUrl = config.urlUprn
const findByPostcodeUrl = config.urlPostcode

module.exports = [{
  method: 'GET',
  path: '/test',
  handler: async (request, h) => {
    const findByIdUri = sprintf.vsprintf(findByIdUrl, ['123', config.key])
    const findByPostcodeUri = sprintf.vsprintf(findByPostcodeUrl, ['CW8 4AA', config.key])
    const proxyUrl2 = getProxyForUrl(findByIdUri)
    const proxyUrl1 = getProxyForUrl(findByPostcodeUri)

    const wreck = require('@hapi/wreck').defaults({
      timeout: config.httpTimeoutMs,
      agent: new HttpsProxyAgent(config.http_proxy)
    })

    try {
      const data = await wreck.get(findByPostcodeUri, { json: true })

      return {
        data,
        proxyUrl1,
        proxyUrl2,
        http_proxy: process.env.HTTP_PROXY,
        https_proxy: process.env.HTTPS_PROXY
      }
    } catch (err) {
      return {
        err,
        proxyUrl1,
        proxyUrl2,
        http_proxy: process.env.HTTP_PROXY,
        https_proxy: process.env.HTTPS_PROXY
      }
    }
  }
}]
