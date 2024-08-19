function defineBackLink (currentPage, referer, postcode) {
  if ((currentPage === '/search') && (postcode)) {
    return '/search?postcode=' + postcode.split(' ').join('%20')
  }

  if ((currentPage === '/risk') && (postcode)) {
    return '/search?postcode=' + postcode.split(' ').join('%20')
  }
  if (currentPage === '/map') {
    return referer || '/postcode'
  }
  return '/postcode'
}

module.exports = {
  defineBackLink
}
