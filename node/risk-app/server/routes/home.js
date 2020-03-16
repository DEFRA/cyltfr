module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: {
      view: {
        template: 'home',
        context: { noIndex: false }
      }
    },
    options: {
      description: 'Get the home page'
    }
  }
]
