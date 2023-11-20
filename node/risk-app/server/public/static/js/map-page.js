/* global mapCategories $ */
function MapController (categories) {
  this._categories = categories
}

/**
 * setCurrent
 * @param {string} ref The ref of either a category or map. If a category ref is passed, the first map in that category is used.
 */
MapController.prototype.setCurrent = function (ref) {
  // Work out the current category and map
  let category, map, defaultCategory, defaultMap
  for (let i = 0; i < this._categories.length; i++) {
    category = this._categories[i]
    if (i === 0) {
      defaultCategory = category
    }

    if (category.ref === ref) {
      this.currMap = category.maps[0]
      this.currCategory = category
      return
    }

    for (let j = 0; j < category.maps.length; j++) {
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
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    const results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }

  function mapPage () {
    const mapController = new MapController(mapCategories.categories)
    const extentRadio = document.getElementById('sw-extent-radio')
    const depthRadio = document.getElementById('sw-depth-radio')
    const velocityRadio = document.getElementById('sw-velocity-radio')
    const $header = $('.govuk-radios')
    const $selector = $('input[name=measurements]')
    const $map = $('#map')
    const $body = $(document.body)

    const easting = parseInt(getParameterByName('easting'), 10)
    const northing = parseInt(getParameterByName('northing'), 10)
    const hasLocation = !!easting
    const maps = window.maps

    maps.loadMap(hasLocation && [easting, northing])

    // This function updates the map to the radio button you select (extent, depth, velocity)
    function setCurrent (ref) {
      mapController.setCurrent(ref)

      const currMap = mapController.currMap

      // Update the mobile nav
      $selector.val(currMap.ref)

      // Depending on which radio button is selected, the relevant map layer reference is assigned
      function selectedOption () {
        if (extentRadio.checked) {
          return 'SurfaceWater_6-SW-Extent'
        }
        if (depthRadio.checked) {
          return 'SurfaceWater_9-SWDH'
        }
        if (velocityRadio.checked) {
          return 'SurfaceWater_12-SWVH'
        }
      }
      const mapReferenceValue = selectedOption()

      maps.showMap('risk:' + mapReferenceValue.substring(mapReferenceValue.indexOf('_') + 1))
    }

    // Default to the first category/map
    maps.onReady(function () {
      // Handle the mobile map selector change
      $header.on('change', 'input[name="measurements"]', function (e) {
        e.preventDefault()
        setCurrent($(this).val())
      })

      setCurrent(getParameterByName('map'))
    })

    // ensures mouse cursor returns to default if feature was at edge of map
    $map.on('mouseleave', function (e) {
      $body.css('cursor', 'default')
    })
  }

  mapPage()
})()

/* eslint-disable no-unused-vars */
// This function adjusts the descriptions that appear/disappear depending on selected radio button
function handleRadioChange (selected) {
  const maps = window.maps

  const extentInfo = document.getElementById('sw-extent-desc-container')
  const depthInfo = document.getElementById('sw-depth-desc-container')
  const velocityInfo = document.getElementById('sw-velocity-desc-container')

  if (selected === 'extent') {
    extentInfo.style.display = 'block'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'none'
  }
  if (selected === 'depth') {
    extentInfo.style.display = 'none'
    depthInfo.style.display = 'block'
    velocityInfo.style.display = 'none'
  }
  if (selected === 'velocity') {
    extentInfo.style.display = 'none'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'block'
  }
}
/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */
function toggleCopyrightInfo () {
  const copyrightInfoContainer = document.getElementsByClassName('defra-map-info__container')
  if (!copyrightInfoContainer[0].classList.contains('showing')) {
    copyrightInfoContainer[0].classList.add('showing')
    copyrightInfoContainer[0].style.display = 'block'
  } else {
    copyrightInfoContainer[0].classList.remove('showing')
    copyrightInfoContainer[0].style.display = 'none'
  }
}
/* eslint-enable no-unused-vars */

/* eslint-disable no-unused-vars */
function toggleAdvancedOptions () {
  const advancedMapOptions = document.getElementsByClassName('advanced-map-option')
  if (!advancedMapOptions[0].classList.contains('showing')) {
    advancedMapOptions[0].classList.add('showing')
    advancedMapOptions[0].style.display = 'block'
  } else {
    advancedMapOptions[0].classList.remove('showing')
    advancedMapOptions[0].style.display = 'none'
  }
}
/* eslint-enable no-unused-vars */
