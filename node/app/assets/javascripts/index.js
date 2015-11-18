var $ = require('jquery')

/*
 * Todo: This needs redoing/finishing off.
 */
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
