const OsViewModel = require('../models/os-terms-view')

module.exports = {
  method: 'GET',
  path: '/os-terms',
  options: {
    description: 'Get Ordnance Survey terms and conditions',
    handler: (request, h) => {
      return h.view('os-terms', new OsViewModel(request.query.err))
    }
  }
}
