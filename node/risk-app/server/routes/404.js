module.exports = {
  method: 'GET',
  path: '/{path*}',
  options: {
    description: 'File not found',
    handler: {
      view: '404'
    }
  }
}
