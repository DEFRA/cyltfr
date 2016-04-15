/* global $ */

$(function () {
  $('.risk').on('click', 'a[toggle]', function (e) {
    e.preventDefault()
    e.stopPropagation()

    var $risk = $(e.delegateTarget)
    $risk.toggleClass('detail')
    window.scrollTo(0, 0)
  })
})
