module.exports = {
  method: 'GET',
  path: '/ground-water',
  handler: async (request, h) => {
    return h.view('ground-water')
  }
}
