/* global $ */

function SearchPage (options) {
  var $banner = $('#banner')
  var postcode = window.encodeURIComponent(options.postcode)

  // Load any current flood alerts or warnings for this area
  $banner.load('banner?postcode=' + postcode, function (response, status, xhr) {
    if (status === 'success' && response) {
      $banner.slideDown()
    }
  })
}

module.exports = SearchPage
