module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: (_request, h) => {
      return h.redirect('/postcode').permanent()
    },
    options: {
      description: 'Get the home page'
    }
  }
]
