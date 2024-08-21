function defineBackLink (currentPage, previousPage, postcode) {
  if ((currentPage === '/search') && (postcode)) {
    return '/search?postcode=' + postcode.split(' ').join('%20')
  }

  if ((currentPage === '/risk') && (postcode)) {
    return '/search?postcode=' + postcode.split(' ').join('%20')
  }
  if (currentPage === '/map') {
    return previousPage || '/postcode'
  }
  return '/postcode'
}

module.exports = {
  defineBackLink
}
