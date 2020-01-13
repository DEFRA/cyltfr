const { formatDate } = require('../helpers')

class HomeView {
  constructor (comments, provider) {
    const dateMapper = (field, row) => ({
      text: row[field.name]
        ? formatDate(row[field.name], 'D/M/YYYY h:mma')
        : ''
    })

    const loadedAtMapper = (field, row) => {
      return row.lastError
        ? { html: '<span class="error-text">Error</span>' }
        : dateMapper(field, row)
    }

    const fields = [
      {
        name: 'description',
        title: 'Description',
        mapper: (field, row) => ({
          html: `<a href="/comment/view/${row.id}">${row.description}</a>`
        })
      },
      {
        name: 'type',
        title: 'Type',
        mapper: (field, row) => ({
          text: row[field.name] === 'holding' ? 'Holding' : 'LLFA'
        })
      },
      { name: 'featureCount', title: 'Number of features' },
      // { name: 'createdBy', title: 'Created by' },
      // { name: 'createdAt', title: 'Created at', mapper: dateMapper },
      { name: 'approvedBy', title: 'Approved by' },
      { name: 'approvedAt', title: 'Approved at', mapper: dateMapper },
      { name: 'loadedAt', title: 'Last loaded at', mapper: loadedAtMapper }
    ]

    const head = fields.map(f => ({
      text: f.title
    }))

    const rows = comments.map(r => {
      return fields.map(f => f.mapper ? f.mapper(f, r) : ({
        text: r[f.name] || ''
      }))
    })

    this.table = {
      head,
      rows
    }

    this.comments = comments
  }
}

module.exports = HomeView
