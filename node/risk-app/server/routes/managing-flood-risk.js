// const joi = require('@hapi/joi')

module.exports = {
  method: 'GET',
  path: '/managing-flood-risk',
  handler: {
    view: 'managing-flood-risk'
  },
  options: {
    description: 'Get the managing flood risk page'
  }
}
