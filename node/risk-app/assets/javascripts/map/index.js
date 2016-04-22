var $ = require('jquery')
var loadMap = require('./map')
var legendTemplate = require('./legend.hbs')
var Maps = require('../../../lib/models/maps')
var maps = new Maps()

var easting = getParameterByName('easting')
var northing = getParameterByName('northing')

loadMap.loadMap(easting ? [easting, northing] : undefined)

function getParameterByName (name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

$(function () {
  var selected = 'selected'
  var $container = $('.map-container')
  var $sidebar = $('ul.nav', $container)
  var $selector = $('select', $container)
  var $categories = $sidebar.children('li.category')
  var $maps = $categories.find('li')
  // Store a reference to the map legend element
  var $legend = $('.legend')

  function setCurrent (ref) {
    maps.setCurrent(ref)

    var currMap = maps.currMap
    var currCategory = maps.currCategory

    // Update the legend
    $legend.html(legendTemplate(currMap.legend))

    // Update the main nav
    $categories.removeClass(selected)
    $categories.filter('#' + currCategory.ref).addClass(selected)
    $maps.removeClass(selected)
    $maps.filter('#' + currMap.ref).addClass(selected)

    // Update the mobile nav
    $selector.val(currMap.ref)

    // Load the map
    loadMap.showMap('risk:' + currMap.ref.substring(currMap.ref.indexOf('_') + 1))
  }

  // Default to the first category/map
  loadMap.onReady(function () {
    // Handle the category header clicks
    $categories.on('click', 'h2', function (e) {
      e.preventDefault()
      var $category = $(this).parent()
      if (!$category.hasClass(selected)) {
        setCurrent($category.attr('id'))
      }
    })

    // Handle the map selector clicks
    $maps.on('click', function (e) {
      e.preventDefault()
      setCurrent($(this).attr('id'))
    })

    // Accessibility, allow tab and enter for map selection
    $maps.keypress(function (e) {
      var keycode = (e.keyCode ? e.keyCode : e.which)
      if (keycode === 13) {
        e.preventDefault()
        setCurrent($(this).attr('id'))
      }
    })

    // Handle the mobile map selector change
    $selector.on('change', function (e) {
      e.preventDefault()
      setCurrent($(this).val())
    })

    setCurrent(getParameterByName('map'))
  })

  $('.feature-popup-closer').click(function () {
    return loadMap.closePopup()
  })

  $container.on('click', '.map-switch a', function (e) {
    e.preventDefault()
    $(e.delegateTarget).toggleClass('detailed')
  })

  $('.map-switch a').keypress(function (e) {
    var keycode = (e.keyCode ? e.keyCode : e.which)
    if (keycode === 13) {
      e.preventDefault()
      $container.toggleClass('detailed')
    }
  })
})
