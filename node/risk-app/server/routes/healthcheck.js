module.exports = [
  {
    method: 'GET',
    path: '/healthcheck',
    handler: async (_request, _h) => {
      return 'ok'
    },
    options: {
      description: 'Get healthcheck response: "ok" 200'
    }
  }
]
