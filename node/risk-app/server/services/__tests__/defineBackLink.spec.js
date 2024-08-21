const defineBackLink = require('../defineBackLink.js')

describe('defineBackLink', () => {
  test('Risk page backlink takes user back to search page with entered postcode showing', async () => {
    const searchPagePath = '/search?postcode='
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/risk'
    const previousPage = null
    const backLink = defineBackLink.defineBackLink(currentPage, previousPage, cachedPostcode)
    expect(backLink).toEqual(searchPagePath + cachedPostcode)
  })

  test('England-only page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'NP18%203EZ'
    const currentPage = '/england-only'
    const backLink = defineBackLink.defineBackLink(currentPage, cachedPostcode)
    expect(backLink).toEqual(postcodePage)
  })

  test('Map page backlink takes user back to surface water page if this is the page they came from', async () => {
    const previousPage = '/surface-water'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage, previousPage)
    expect(backLink).toEqual(previousPage)
  })

  test('Map page backlink takes user back to rivers and sea page if this is the page they came from', async () => {
    const previousPage = '/rivers-and-sea'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage, previousPage)
    expect(backLink).toEqual(previousPage)
  })

  test('Map page backlink takes user back to ground water page if this is the page they came from', async () => {
    const previousPage = '/ground-water'
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage, previousPage)
    expect(backLink).toEqual(previousPage)
  })

  test('Map page backlink takes user back to postcode page if user did not come from risk pages', async () => {
    const postcodePage = '/postcode'
    const previousPage = ''
    const currentPage = '/map'
    const backLink = defineBackLink.defineBackLink(currentPage, previousPage)
    expect(backLink).toEqual(postcodePage)
  })

  test('Search page backlink takes user back to postcode page', async () => {
    const postcodePage = '/postcode'
    const cachedPostcode = 'CF1%204QR'
    const currentPage = '/search' + cachedPostcode
    const backLink = defineBackLink.defineBackLink(currentPage)
    expect(backLink).toEqual(postcodePage)
  })
})
