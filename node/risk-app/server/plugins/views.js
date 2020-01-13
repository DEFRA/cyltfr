const path = require('path')
const nunjucks = require('nunjucks')
const config = require('../config')
const pkg = require('../../package.json')
const analyticsAccount = config.analyticsAccount

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      html: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)

          return (context) => {
            return template.render(context)
          }
        },
        prepare: (options, next) => {
          options.compileOptions.environment = nunjucks.configure([
            path.join(options.relativeTo || process.cwd(), options.path),
            'node_modules/govuk-frontend/govuk/',
            'node_modules/govuk-frontend/govuk/components/'
          ], {
            autoescape: true,
            watch: false
          })

          return next()
        }
      }
    },
    path: '../views',
    relativeTo: __dirname,
    isCached: !config.isDev,
    context: {
      appVersion: pkg.version,
      mountPath: config.mountPath,
      assetPath: `/${config.mountPath}/assets`,
      serviceName: 'Long term flood risk information',
      serviceUrl: `/${config.mountPath}/`,
      homepageUrl: '/',
      pageTitle: 'Long term flood risk information - GOV.UK',
      analyticsAccount: analyticsAccount,
      appStage: config.env,
      floodWarningsUrl: config.floodWarningsUrl,
      phase: 'beta',
      feedback: true,
      siteUrl: config.floodRiskUrl,
      fbAppId: config.fbAppId,
      ogDescription: 'Check your risk of flooding and use flood risk maps',
      noIndex: true // stop robot crawl by default
    }
  }
}
