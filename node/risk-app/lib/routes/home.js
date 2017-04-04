var HomeViewModel = require('../models/home-view')

module.exports = {
  method: 'GET',
  path: '/',
  config: {
    description: 'Get homepage',
    handler: function (request, reply) {
      reply.view('home', new HomeViewModel(request.query))
    }
  }
}
