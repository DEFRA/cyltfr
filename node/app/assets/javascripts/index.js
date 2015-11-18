var $ = require('jquery')
// var Maps = require('../../lib/models/maps')
// var maps = new Maps()
//
// $(function () {
//   var selected = 'selected'
//   var $container = $('.map-container')
//   var $sidebar = $('ul.sidebar', $container)
//   var $selector = $('select', $container)
//   var $categories = $sidebar.children('li.category')
//   var $maps = $categories.find('li')
//
//   // Store a reference to the map title element
//   var $title = $('h3.lede')
//
//   // Store a reference to the map title element
//   var $title = $('h3.lede')
//
//   function setCurrentMap (ref) {
//     var currMap = maps.setCurrentMap(ref)
//     var currCategory = maps.currCategory
//
//     // Update the title
//     $title.text(maps.currMap.title)
//
//     // Update the main nav
//     $categories.removeClass(selected)
//     $categories.find('#' + currCategory.ref).addClass(selected)
//
//     // Update the mobile nav
//   }
//
//   setCurrentMap('RiversOrSea_1-ROFRS')
// })

$(function () {
  var selected = 'selected'
  var $container = $('.map-container')
  var $sidebar = $('ul.sidebar', $container)
  var $selector = $('select', $container)
  var $categories = $sidebar.children('li.category')
  var $maps = $categories.find('li')

  function loadMap (ref) {
    $selector.val(ref)
    riskMap.showMap('risk:' + ref.substring(ref.indexOf('_') + 1))
    console.log('loading map', ref)
  }

  function openMapNav (ref) {
    loadMap(ref)
    var $map = $sidebar.find('#' + ref).addClass(selected)
    var $category = $map.closest('li.category')
    $categories.not($category).removeClass(selected)
    $category.addClass(selected)
  }

  $categories.on('click', 'h3', function (e) {
    var $category = $(this).parent()
    if ($category.hasClass(selected)) {
      $category.removeClass(selected)
    } else if ($category.find('.selected').length) {
      $category.addClass(selected)
    } else {
      $maps.removeClass(selected)
      openMapNav($category.find('li:first').attr('id'))
    }
  })

  $maps.on('click', function (e) {
    var $this = $(this).addClass(selected)
    $maps.not($this).removeClass(selected)
    loadMap($this.attr('id'))
  })

  openMapNav('RiversOrSea_1-ROFRS')
})
