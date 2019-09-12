const handlebars = require('handlebars')
const config = require('../config')
const pkg = require('../package.json')
const analyticsAccount = config.analyticsAccount
const appVersion = pkg.version
const mountPath = config.mountPath
  ? '/' + config.mountPath + '/'
  : '/'
const assetPath = mountPath + 'public/'

/*
 * Create the handlebars engine
 */
const engine = handlebars.create()

const helpers = require('./helpers')
for (const key in helpers) {
  if (Object.prototype.hasOwnProperty.call(helpers, key)) {
    engine.registerHelper(key, helpers[key])
  }
}

const defaultContext = {
  globalHeaderText: 'GOV.UK',
  pageTitle: 'Long term flood risk assessment for locations in England - GOV.UK',
  skipLinkMessage: 'Skip to main content',
  homepageUrl: 'https://www.gov.uk/',
  logoLinkTitle: 'Go to the GOV.UK homepage',
  crownCopyrightMessage: '© Crown copyright',
  mountPath: mountPath,
  assetPath: assetPath,
  htmlLang: 'en',
  headerClass: 'with-proposition',
  analyticsAccount: analyticsAccount,
  appVersion: appVersion,
  appStage: config.errbit.env,
  floodWarningsUrl: config.floodWarningsUrl,
  phase: 'beta', // alpha or beta, blank is live and requires no phase banner
  feedback: true,
  siteUrl: config.floodRiskUrl,
  fbAppId: config.fbAppId,
  ogDescription: 'Check your risk of flooding and use flood risk maps',
  noIndex: true // stop robot crawl by default
}

const options = {
  engines: {
    html: engine
  },
  relativeTo: process.cwd(),
  path: 'views',
  partialsPath: 'views/partials',
  context: defaultContext,
  layout: true,
  isCached: config.cacheViews
}

module.exports = options
