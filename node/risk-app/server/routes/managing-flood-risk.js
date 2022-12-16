
module.exports = {
  method: 'GET',
  path: '/managing-flood-risk',
  handler: {
    view: {
      template: 'managing-flood-risk',
      context: { noIndex: false }
    }
  },
  options: {
    description: 'Get the managing flood risk page'
  }
}
