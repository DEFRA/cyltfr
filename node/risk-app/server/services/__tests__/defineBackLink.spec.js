const defineBackLink = require('../defineBackLink.js')

describe('defineBackLink', () => {
  test('Risk page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/risk'
    const referer = null
    const backLink = defineBackLink.defineBackLink(currentPage, referer, cachedPostcode)
    expect(backLink).toEqual(searchPagePath + cachedPostcode)
  })

  test('England-only page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'NP18%203EZ'
    const currentPage = '/england-only'
    const backLink = defineBackLink.defineBackLink(currentPage, cachedPostcode)
    expect(backLink).toEqual(postcodePage)
  })

  test('Map page backlink takes user back to previous page', async () => {
    const referer = '/surface-water'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage, referer)
    expect(backLink).toEqual(referer)
  })

  test('Search page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/search' + cachedPostcode
    const backLink = defineBackLink.defineBackLink(currentPage)
    expect(backLink).toEqual(postcodePage)
  })
})
