const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const defineBackLink = require('../../server/services/defineBackLink.js')

lab.experiment('defineBackLink', () => {
  lab.test('Risk page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/risk'
    const backLink = defineBackLink.defineBackLink(currentPage, null, cachedPostcode)
    Code.expect(backLink).to.equal(searchPagePath + cachedPostcode)
  })

  lab.test('Risk page backlink takes user back to risk page if it includes query coordinates', async () => {
    const riskPage = '/risk'
    const request = {
      path: '/map',
      orig: {
        query: {
          easting: '1232',
          northing: '1232',
          map: 'seaandriver'
        }
      }
    }
    const backLink = defineBackLink.defineBackLink(request.path, request.orig)
    Code.expect(backLink).to.equal(riskPage)
  })

  lab.test('England-only page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'NP18%203EZ'
    const currentPage = '/england-only'
    const backLink = defineBackLink.defineBackLink(currentPage, null, cachedPostcode)
    Code.expect(backLink).to.equal(searchPagePath + cachedPostcode)
  })

  lab.test('Map page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage)
    Code.expect(backLink).to.equal(postcodePage)
  })

  lab.test('Map page backlink takes user back to postcode page even if directed through bookmark', async () => {
    const postcodePage = '/postcode'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage)
    Code.expect(backLink).to.equal(postcodePage)
  })

  lab.test('Search page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/search' + cachedPostcode
    const backLink = defineBackLink.defineBackLink(currentPage)
    Code.expect(backLink).to.equal(postcodePage)
  })
})
