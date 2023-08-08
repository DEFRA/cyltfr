function defineBackLink (currentPage, mapPageQuery, postcode) {
  if (currentPage === '/risk' || currentPage === '/england-only') {
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
