module.exports = {
  method: 'GET',
  path: '/status',
  handler: async (request, h) => {
    return 'ok'
  },
  options: {
    auth: false
  }
}
