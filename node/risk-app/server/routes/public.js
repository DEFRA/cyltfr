module.exports = [
  {
    method: 'GET',
    path: '/robots.txt',
    handler: {
      file: 'server/public/static/robots.txt'
    },
    options: {
      description: 'Get the robots.txt'
    }
  },
  {
    method: 'GET',
    path: '/assets/all.js',
    handler: {
      file: 'node_modules/govuk-frontend/govuk/all.js'
    },
    options: {
      description: 'Get the GDS all.js asset'
    }
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: [
          'server/public/static',
          'server/public/build',
          'node_modules/govuk-frontend/govuk/assets',
          'node_modules/nunjucks/browser'
        ]
      }
    },
    options: {
      description: 'Get public assets'
    }
  }
]
