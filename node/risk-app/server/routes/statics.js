module.exports = {
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    directory: {
      path: ['public']
    }
  }
}
