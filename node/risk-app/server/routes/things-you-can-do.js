// const joi = require('@hapi/joi')

module.exports = {
  method: 'GET',
  path: '/things-you-can-do',
  handler: async (request, h) => {
    const model = {}

    return h.view('things-you-can-do', model)
  }
  // ,
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
