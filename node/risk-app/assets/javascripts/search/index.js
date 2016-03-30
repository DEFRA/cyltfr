/* global $ */

function SearchPage (options) {
  var $banner = $('#banner')
  var postcode = window.encodeURIComponent(options.postcode)

  $banner.load('/banner?postcode=' + postcode, function (response, status, xhr) {
    if (status === 'success' && response) {
      $banner.slideDown()
    }
  })
}

module.exports = SearchPage
