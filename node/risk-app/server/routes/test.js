const sprintf = require('sprintf-js')
const { getProxyForUrl } = require('proxy-from-env')
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

    return {
      proxyUrl1,
      proxyUrl2
    }
  }
}]
