// const joi = require('@hapi/joi')

module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    const model = {
      isWales: request.query.region === 'wales',
      isScotland: request.query.region === 'scotland',
      isNorthernIreland: request.query.region === 'northern-ireland'
    }

    return h.view('confirmation', model)
  },
  // options: {
  //   description: 'Get the england only page',
  //   validate: {
  //     query: {
  //       region: joi.string().allow('', 'wales', 'northern-ireland', 'scotland'),
  //       premises: joi.string().allow(''),
  //       postcode: joi.string().allow(''),
  //       uprn: joi.string().allow('')
  //     }
  //   }
  // }
}