const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/error',
  options: {
    description: 'Path to test error handling',
    handler: async (request, h) => {
      return Boom.badImplementation('/error test path', new Error())
    }
  }
}
