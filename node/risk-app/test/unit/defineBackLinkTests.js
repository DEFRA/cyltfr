const Lab = require('@hapi/lab')
const Code = require('@hapi/code')
const lab = exports.lab = Lab.script()
const defineBackLink = require('../../server/services/defineBackLink.js')

lab.experiment('defineBackLink', () => {
  lab.test('Risk page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/risk'
    const backLink = defineBackLink.defineBackLink(currentPage, cachedPostcode)
    Code.expect(backLink).to.equal(searchPagePath + cachedPostcode)
  })

  lab.test('England-only page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'NP18%203EZ'
    const currentPage = '/england-only'
    const backLink = defineBackLink.defineBackLink(currentPage, cachedPostcode)
    Code.expect(backLink).to.equal(searchPagePath + cachedPostcode)
  })

  lab.test('Map page backlink takes user back to risk page', async () => {
    const riskPage = '/risk'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage)
    Code.expect(backLink).to.equal(riskPage)
  })

  lab.test('Search page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/search' + cachedPostcode
    const backLink = defineBackLink.defineBackLink(currentPage)
    Code.expect(backLink).to.equal(postcodePage)
  })
})
