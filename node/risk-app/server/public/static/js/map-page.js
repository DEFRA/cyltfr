/* global map mapCategories $ */

function MapController (categories) {
  // this._data = data
  this._categories = categories
  // this.setCurrent(ref)
}

/**
 * setCurrent
 * @param {string} ref The ref of either a category or map. If a category ref is passed, the first map in that category is used.
 */
MapController.prototype.setCurrent = function (ref) {
  // Work out the current category and map
  var category, map, defaultCategory, defaultMap
  for (var i = 0; i < this._categories.length; i++) {
    category = this._categories[i]
    if (i === 0) {
      defaultCategory = category
    }

    if (category.ref === ref) {
      this.currMap = category.maps[0]
      this.currCategory = category
      return
    }

    for (var j = 0; j < category.maps.length; j++) {
      map = category.maps[j]
      if (i === 0 && j === 0) {
        defaultMap = map
      }

      if (map.ref === ref) {
        this.currMap = map
        this.currCategory = category
        return
      }
    }
  }

  this.currMap = defaultMap
  this.currCategory = defaultCategory
}

;(function () {
  function getParameterByName (name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    var results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  function legendTemplate (data) {
    return window.nunjucks.render('legend.html', data)
  }

  function mapPage () {
    var mapRefs = [].concat.apply([], mapCategories.categories.map(c => c.maps))
    var mapController = new MapController(mapCategories.categories)

    // var selected = 'selected'
    var $page = $('main#map-page')
    var $container = $('.map-container')
    var $sidebar = $('.sidebar')
    var $selector = $('select', $sidebar)
    var $error = $('#error-message', $container)
    var $query = $('input[name=location]', $container)
    var $map = $('#map')
    var $body = $(document.body)

    var easting = parseInt(getParameterByName('easting'), 10)
    var northing = parseInt(getParameterByName('northing'), 10)
    var hasLocation = !!easting
    var maps = window.maps

    maps.loadMap(hasLocation && [easting, northing])

    // Store a reference to the map legend element
    var $legend = $('#legend')

    function setCurrent (ref) {
      mapController.setCurrent(ref)

      var currMap = mapController.currMap

      // Update the mobile nav
      $selector.val(currMap.ref)

      // Update the legend
      $legend.html(legendTemplate(Object.assign({ hasLocation }, currMap.legend)))

      // Load the map
      maps.showMap('risk:' + currMap.ref.substring(currMap.ref.indexOf('_') + 1))
    }

    // Default to the first category/map
    maps.onReady(function () {
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
        var url = '/long-term-flood-risk/api/geocode?location=' + location
        $error.text('')

        $.ajax({
          url: url
        }).done(function (data) {
          if (data) {
            if (data.isEngland) {
              var point = [data.easting, data.northing]
              maps.panTo(point, 7)
            } else {
              $error.text(noResults)
            }
          } else {
            $error.text(noResults)
          }
        }).fail(function (jqxhr, textStatus, error) {
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

    // ensures mouse cursor returns to default if feature was at edge of map
    $map.on('mouseleave', function (e) {
      $body.css('cursor', 'default')
    })
  }

  mapPage()
})()
