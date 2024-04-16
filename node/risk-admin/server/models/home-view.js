const { formatDate } = require('../helpers')

class HomeView {
  constructor (comments) {
    const defaultMapper = (field, row) => ({
      text: row[field.name] || ''
    })

    const loadedAtMapper = (_field, row) => {
      if (row.lastError) {
        return { html: '<span class="error-text">Error</span>' }
      }

      const { loadedAt } = row
      if (loadedAt) {
        return {
          html: `<span title="Last loaded at ${formatDate(loadedAt, 'D/M/YYYY h:mma')}">✅</span>`,
          attributes: { style: 'text-align: center;', 'data-sort': loadedAt }
        }
      }
      return null
    }

    const approvedMapper = (_field, row) => {
      const { approvedAt, approvedBy } = row

      if (!approvedAt) {
        return null
      }

      return {
        html: `<span title="Approved by ${approvedBy} at ${formatDate(approvedAt, 'D/M/YYYY h:mma')}">✅</span>`,
        attributes: { style: 'text-align: center;', 'data-sort': approvedAt }
      }
    }

    const fields = [
      {
        name: 'description',
        title: 'Description',
        mapper: (_field, row) => ({
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
      { name: 'featureCount', title: 'Features' },
      { name: 'boundary', title: 'Boundary' },
      { name: 'approvedAt', title: 'Approved', mapper: approvedMapper },
      { name: 'loadedAt', title: 'Loaded', mapper: loadedAtMapper }
    ]

    const head = fields.map(f => ({
      text: f.title
    }))

    const rows = comments.map(r => {
      return fields.map(f => f.mapper ? f.mapper(f, r) : defaultMapper(f, r))
    })

    this.table = {
      head,
      rows
    }

    this.comments = comments
  }
}

module.exports = HomeView
