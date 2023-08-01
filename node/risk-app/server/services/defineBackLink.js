async function defineBackLink (currentPage, postcode) {
  if (currentPage === '/risk' || currentPage === '/england-only') {
    return '/search?postcode=' + postcode
  }
  return '/postcode'
}

module.exports = {
  defineBackLink
}
