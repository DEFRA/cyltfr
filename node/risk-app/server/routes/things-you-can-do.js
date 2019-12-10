// const joi = require('@hapi/joi')

module.exports = {
  method: 'GET',
  path: '/things-you-can-do',
  handler: async (request, h) => {
    const model = {}
    return h.view('things-you-can-do', model)
  },
  options: {
    description: 'Get the actions page'
  }
}
