// const boom = require('@hapi/boom')
const util = require('util')
const jsonexport = require('jsonexport')
const config = require('../config')
const toCSV = util.promisify(jsonexport)

module.exports = {
  method: 'GET',
  path: '/comments.csv',
  handler: async (request, h) => {
    const { auth, provider } = request

    const comments = await provider.load()
    const homeComments = auth.credentials.isApprover
      ? comments
      : comments.filter(c => c.createdBy === auth.credentials.profile.email)

    const files = await Promise
      .all(homeComments
        .map(c => provider.getFile(`${config.holdingCommentsPrefix}/${c.keyname}`)))

    const baseUrl = request.url.origin
    const rows = homeComments
      .map((comment, i) => {
        const file = JSON.parse(files[i].Body.toString())

        return file.features.map(feature => {
          const { start, end, info } = feature.properties

          return {
            ...comment,
            start,
            end,
            info,
            url: `${baseUrl}/comment/view/${comment.id}`
          }
        })
      })

    const csv = await toCSV(rows.flat())

    return h.response(csv).type('text/csv')
  }
}
