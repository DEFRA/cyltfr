const joi = require('@hapi/joi')
const wreck = require('@hapi/wreck')
module.exports = {
  method: 'GET',
  path: '/england-only',
  handler: async (request, h) => {

    const url = 'http://internal-DEVLTFBESELB001-138284812.eu-west-1.elb.amazonaws.com:8050/floodrisk/364932/373262/20'
    const { res, payload } = await wreck.get(url)
    return payload
    // const model = {
    //   isWales: request.query.region === 'wales',
    //   isScotland: request.query.region === 'scotland',
    //   isNorthernIreland: request.query.region === 'northern-ireland'
    // }

    // return h.view('england-only', model)
  },
  options: {
    description: 'Get the england only page',
    validate: {
      query: {
        region: joi.string().allow('', 'wales', 'northern-ireland', 'scotland'),
        premises: joi.string().allow(''),
        postcode: joi.string().allow(''),
        uprn: joi.string().allow('')
      }
    }
  }
}
