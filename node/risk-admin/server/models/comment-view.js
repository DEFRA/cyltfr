const moment = require('moment-timezone')

class CommentView {
  constructor (comment, geometry, auth) {
    this.comment = comment
    this.geometry = geometry

    this.viewHeaderData = {
      firstCellIsHeader: true,
      rows: [
        [{ text: 'Description' }, { text: comment.description }],
        [{ text: 'Created at' }, { text: moment(comment.createdAt).format('DD/MM/YYYY h:mma') }],
        [{ text: 'Created by' }, { text: comment.createdBy }],
        [{ text: 'Updated at' }, { text: moment(comment.updatedAt).format('DD/MM/YYYY h:mma') }],
        [{ text: 'Updated by' }, { text: comment.updatedBy }],
        [{ text: 'Approved at' }, { text: comment.approvedAt && moment(comment.approvedAt).format('DD/MM/YYYY h:mma') }],
        [{ text: 'Approved by' }, { text: comment.approvedBy }]
      ]
    }

    if (comment.lastError) {
      const timestamp = moment(comment.lastError.timestamp).format('DD/MM/YYYY h:mma')

      this.viewHeaderData.rows.push([
        { text: 'Last error' },
        { text: `${comment.lastError.message} ${timestamp}` }
      ])
    }

    this.viewCommentData = {
      head: [
        { text: 'Comment' },
        { text: 'Start' },
        { text: 'End' }
      ],
      rows: geometry.features.map(f => ([
        { text: f.properties.info },
        { text: moment(f.properties.start).format('DD/MM/YYYY') },
        { text: moment(f.properties.end).format('DD/MM/YYYY') }
      ]))
    }

    this.isApprover = auth.credentials.isApprover
    this.allowDelete = auth.credentials.isApprover ||
      comment.createdBy === auth.credentials.profile.email
  }
}

module.exports = CommentView
