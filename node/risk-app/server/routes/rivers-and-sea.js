module.exports = {
  method: 'GET',
  path: '/rivers-and-sea',
  handler: async (request, h) => {
    return h.view('rivers-and-sea')
  }
}
