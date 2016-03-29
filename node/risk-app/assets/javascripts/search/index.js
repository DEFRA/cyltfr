/* global $ */

function SearchPage (options) {
  options = $.extend(true, options)

  var $banner = $('#banner')
  $banner.load('/banner?postcode=' + window.encodeURIComponent(options.postcode), function (response, status, xhr) {
    if (response && status === 'success') {
      $banner.slideDown()
    }
  })
}

module.exports = SearchPage
