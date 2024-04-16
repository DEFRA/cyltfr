const moment = require('moment-timezone')
const { DATETIMEFORMAT, DATEFORMAT } = require('../constants')

class CommentView {
  constructor (comment, geometry, auth, capabilities) {
    this.comment = comment
    this.geometry = geometry
    this.capabilities = capabilities

    this.viewHeaderData = {
      firstCellIsHeader: true,
      rows: [
        [{ text: 'Description' }, { text: comment.description }],
        [{ text: 'Boundary' }, { text: comment.boundary }],
        [{ text: 'Type' }, { text: comment.type === 'holding' ? 'Holding' : 'LLFA' }],
        [{ text: 'Created at' }, { text: moment(comment.createdAt).format() }],
        [{ text: 'Created by' }, { text: comment.createdBy }],
        [{ text: 'Updated at' }, { text: moment(comment.updatedAt).format(DATETIMEFORMAT) }],
        [{ text: 'Updated by' }, { text: comment.updatedBy }],
        [{ text: 'Approved at' }, { text: comment.approvedAt && moment(comment.approvedAt).format(DATETIMEFORMAT) }],
        [{ text: 'Approved by' }, { text: comment.approvedBy }]
      ]
    }

    if (comment.lastError) {
      const timestamp = moment(comment.lastError.timestamp).format(DATETIMEFORMAT)

      this.viewHeaderData.rows.push([
        { text: 'Last error' },
        { text: `${comment.lastError.message} ${timestamp}` }
      ])
    }

    this.viewCommentData = {
      head: [
        { text: comment.type === 'holding' ? 'Info' : 'Report' },
        { text: comment.type === 'holding' ? 'Risk Override' : '' },
        { text: 'Valid from' },
        { text: 'Valid to' },
        { text: '' }
      ],
      rows: geometry.features.map((f, i) => ([
        { text: f.properties.info },
        { text: comment.type === 'holding' ? f.properties.riskOverride : '' },
        { text: moment(f.properties.start).format(DATEFORMAT) },
        { text: moment(f.properties.end).format(DATEFORMAT) },
        { html: `<div id='map_${i}' class='comment-map'></div>` }
      ]))
    }

    this.isApprover = auth.credentials.isApprover
    this.allowDelete = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email
  }
}

module.exports = CommentView
