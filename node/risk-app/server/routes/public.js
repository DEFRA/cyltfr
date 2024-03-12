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
    path: '/assets/govuk-frontend.min.js',
    handler: {
      file: 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js'
    },
    options: {
      description: 'Get the GDS govuk-frontend.min.js asset'
    }
  },
  {
    method: 'GET',
    path: '/assets/govuk-frontend.min.js.map',
    handler: {
      file: 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js.map'
    },
    options: {
      description: 'Get the GDS govuk-frontend.min.js.map asset'
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
          'node_modules/govuk-frontend/dist/govuk/assets',
          'node_modules/nunjucks/browser'
        ]
      }
    },
    options: {
      description: 'Get public assets'
    }
  },
  {
    method: 'GET',
    path: '/ol/{param*}',
    handler: {
      directory: {
        path: 'node_modules/ol/',
        index: false,
        listing: false
      }
    },
    options: {
      description: 'Get the openlayers library'
    }
  },
  {
    method: 'GET',
    path: '/proj4/proj4.js',
    handler: {
      file: 'node_modules/proj4/dist/proj4.js'
    },
    options: {
      description: 'Get the proj4 js asset'
    }
  },
  {
    method: 'GET',
    path: '/proj4/proj4-src.js',
    handler: {
      file: 'node_modules/proj4/dist/proj4-src.js'
    },
    options: {
      description: 'Get the proj4 js asset'
    }
  }
]
