module.exports = {
  method: 'GET',
  path: '/surface-water',
  handler: async (request, h) => {
    return h.view('surface-water')
  }
}
