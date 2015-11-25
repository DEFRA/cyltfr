var $ = require('jquery')
var loadMap = require('./map')
var Maps = require('../../../lib/models/maps')
var maps = new Maps()

loadMap.loadMap()

function generateLegend (meta) {
  var str = '<ul>'
  var key
  for (var i = 0; i < meta.length; i++) {
    key = meta[i]
    str += '<li class="' + key.color + ' ' + key.shape + '">' + key.text + '</li>'
  }
  str += '</ul>'
  return str
}

$(function () {
  var selected = 'selected'
  var $container = $('.map-container')
  var $sidebar = $('ul.sidebar', $container)
  var $selector = $('select', $container)
  var $categories = $sidebar.children('li.category')
  var $maps = $categories.find('li')

  // Store a reference to the map title element
  var $title = $('h3.lede')

  // Store a reference to the map legend element
  var $legend = $('.legend')

  function setCurrent (ref) {
    maps.setCurrent(ref)

    var currMap = maps.currMap
    var currCategory = maps.currCategory

    // Update the title
    $title.text(currMap.title)

    // Update the legend
    $legend.html(generateLegend(currMap.legend))

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
    $categories.on('click', 'h3', function (e) {
      var $category = $(this).parent()
      if ($category.hasClass(selected)) {
        $category.removeClass(selected)
      } else if ($category.find('.selected').length) {
        $category.addClass(selected)
      } else {
        setCurrent($category.attr('id'))
      }
    })

    // Handle the map selector clicks
    $maps.on('click', function (e) {
      setCurrent($(this).attr('id'))
    })

    // Handle the mobile map selector change
    $selector.on('change', function (e) {
      setCurrent($(this).val())
    })

    setCurrent()
  })

  $('.feature-popup-closer').click(function () {
    return loadMap.closePopup()
  })
})
