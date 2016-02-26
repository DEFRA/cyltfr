module.exports = {
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    directory: {
      path: ['public', 'govuk/govuk_template/assets', 'govuk/govuk_frontend_toolkit']
    }
  }
}
