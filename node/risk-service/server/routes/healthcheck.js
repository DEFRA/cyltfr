module.exports = {
  method: 'GET',
  path: '/healthcheck',
  options: {
    description: 'Container healthcheck',
    handler: async (request, h) => {
      return { healthy: 1 }
    }
  }
}
