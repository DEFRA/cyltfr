const { formatDate } = require('../helpers')

class HomeView {
  constructor (comments, provider) {
    const dateMapper = (field, row) => ({
      text: row[field.name]
        ? formatDate(row[field.name], 'D/M/YYYY h:mma')
        : ''
    })

    const loadedAtMapper = (field, row) => {
      if (row.lastError) {
        return { html: '<span class="error-text">Error</span>' }
      }

      const { loadedAt } = row
      if (loadedAt) {
        return {
          html: `<span title="Last loaded at ${formatDate(loadedAt, 'D/M/YYYY h:mma')}">✅</span>`,
          attributes: { style: 'text-align: center;' }
        }
      }
    }

    const approvedMapper = (field, row) => {
      const { approvedAt, approvedBy } = row

      if (!approvedAt) {
        return
      }

      return {
        html: `<span title="Approved by ${approvedBy} at ${formatDate(approvedAt, 'D/M/YYYY h:mma')}">✅</span>`,
        attributes: { style: 'text-align: center;' }
      }
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
      { name: 'boundary', title: 'Boundary' },
      // { name: 'approvedBy', title: 'Approved by' },
      { name: 'approvedAt', title: 'Approved', mapper: approvedMapper },
      { name: 'loadedAt', title: 'Loaded', mapper: loadedAtMapper }
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
