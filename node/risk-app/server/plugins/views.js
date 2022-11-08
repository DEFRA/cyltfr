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
      assetPath: '/assets',
      serviceRef: 'LTF-App',
      serviceName: 'Check your long term flood risk',
      serviceUrl: config.isProd ? 'https://www.gov.uk/check-long-term-flood-risk' : '/postcode',
      pageTitle: 'Check your long term flood risk',
      analyticsAccount,
      appStage: config.env,
      floodWarningsUrl: config.floodWarningsUrl,
      phase: 'beta',
      feedback: true,
      siteUrl: config.floodRiskUrl,
      ogDescription: 'Check your risk of flooding and use flood risk maps',
      noIndex: true, // stop robot crawl by default
      captchaEnabled: config.captchaEnabled,
      captchaSiteKey: config.captchaSiteKey
    }
  }
}
