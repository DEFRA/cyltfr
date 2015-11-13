var maps = require('../models/map.json')

module.exports = {
  method: 'GET',
  path: '/',
  config: {
    description: 'Get homepage',
    handler: function (request, reply) {
      reply.view('index', maps)
    }
  }
}
