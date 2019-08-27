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

    // return {
    //   proxyUrl1,
    //   proxyUrl2,
    //   http_proxy: process.env.http_proxy,
    //   https_proxy: process.env.https_proxy
    // }

    const wreck = config.http_proxy ? require('@hapi/wreck').defaults({
      timeout: config.httpTimeoutMs,
      agent: new HttpsProxyAgent(config.http_proxy)
    }) : require('@hapi/wreck')

    try {
      const data = await wreck.get(findByPostcodeUri, { json: true })

      return {
        data: data.payload,
        proxyUrl1,
        proxyUrl2,
        http_proxy: process.env.HTTP_PROXY,
        https_proxy: process.env.HTTPS_PROXY
      }
    } catch (err) {
      
    }
  }
}]
