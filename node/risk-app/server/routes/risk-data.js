module.exports = {
  method: 'GET',
  path: '/risk-data',
  handler: async (_request, h) => {
    return h.view('risk-data')
  }
}
