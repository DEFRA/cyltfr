module.exports = {
  method: 'GET',
  path: '/{path*}',
  config: {
    description: 'File not found',
    handler: {
      view: '404'
    }
  }
}
