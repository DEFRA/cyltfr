/* global $ */

function SearchPage (options) {
  var $banner = $('#banner')
  $banner.load('/banner?postcode=' + window.encodeURIComponent(options.postcode), function (response, status, xhr) {
    if (status === 'success' && response) {
      $banner.slideDown()
    }
  })
}

module.exports = SearchPage
