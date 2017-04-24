/* global $ */

function SearchPage (options) {
  var $banner = $('#banner')
  var $form = $('form')
  var $address = $('select', $form)
  var postcode = window.encodeURIComponent(options.postcode)

  // Load any current flood alerts or warnings for this area
  $banner.load('banner?postcode=' + postcode, function (response, status, xhr) {
    if (status === 'success' && response) {
      $banner.slideDown()
    }
  })

  // Remove the HTML5 validation fallback
  $address.removeAttr('required')

  // Ensure a valid address selection
  // has been made prior to submitting
  $form.on('submit', function (e) {
    if (!$address.val()) {
      e.preventDefault()
      $form.addClass('invalid')
    }
  })

  // If a valid address selection is made,
  // hide the validation error message
  $address.on('change', function () {
    if ($address.val()) {
      $form.removeClass('invalid')
    }
  })
}

module.exports = SearchPage
