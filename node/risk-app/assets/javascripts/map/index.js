var $ = require('jquery')
var map = require('./map')
var legendTemplate = require('./legend.hbs')
var Maps = require('./maps')
var maps = new Maps()

var easting = getParameterByName('easting')
var northing = getParameterByName('northing')

function getParameterByName (name) {
  name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
  var results = regex.exec(window.location.search)
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function mapPage (options) {
  var selected = 'selected'
  var $page = $('main#map-page')
  var $container = $('.map-container')
  var $sidebar = $('ul.nav', $container)
  var $selector = $('select', $container)
  var $error = $('#error-message', $container)
  var $query = $('input[name=location]', $container)
  var $categories = $sidebar.children('li.category')
  var $maps = $categories.find('li')
  var $map = $('#map')

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
    map.showMap('risk:' + currMap.ref.substring(currMap.ref.indexOf('_') + 1))
  }

  // Default to the first category/map
  map.onReady(function () {
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

    // Handle the mobile map selector change
    $selector.on('change', function (e) {
      e.preventDefault()
      setCurrent($(this).val())
    })

    setCurrent(getParameterByName('map'))
  })

  $container.on('submit', 'form', function (e) {
    e.preventDefault()

    var location = $query.val().replace(/[^a-zA-Z0-9',-.& ]/g, '')
    var noResults = 'No results match this search term.'

    if (location) {
      var url = options.mountPath + 'api/geocode?location=' + location
      $error.text('')

      $.ajax({
        url: url
      }).done(function (data) {
        if (data) {
          if (data.isEngland) {
            var point = [data.easting, data.northing]
            map.panTo(point, 7)
          } else {
            $error.text(noResults)
          }
        } else {
          $error.text(noResults)
        }
      })
      .fail(function (jqxhr, textStatus, error) {
        if (jqxhr.status === 400) {
          $error.text(noResults)
        } else {
          $error.text('There is currently a delay in obtaining the results for this area. Normal service will be resumed as soon as possible. In the meantime please use the map below to find the latest information near you.')
        }
      })
    } else {
      $error.text(noResults)
    }
  })

  $container.on('click', '.map-switch a.toggle-view', function (e) {
    e.preventDefault()
    $(e.delegateTarget).toggleClass('detailed')
  })

  $container.on('click', '.enter-fullscreen', function (e) {
    e.preventDefault()
    $page.addClass('fullscreen')
    $map.css('height', ($(window).height() - 100) + 'px')
    map.updateSize()
  })

  $container.on('click', '.exit-fullscreen', function (e) {
    e.preventDefault()
    $page.removeClass('fullscreen')
    $map.css('height', '')
    map.updateSize()
  })

  map.loadMap(easting && [easting, northing])
}

module.exports = {
  mapPage: mapPage,
  testValues: map.testValues
}
