function defineBackLink (currentPage, postcode) {
  if (currentPage === '/risk' || currentPage === '/england-only') {
    console.log('currentPageInside', currentPage)
    return '/search?postcode=' + postcode
  }
  if (currentPage === '/map') {
    return '/risk'
  }
  return '/postcode'
}

module.exports = {
  defineBackLink
}
