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

function mapPage () {
  function getParameterByName (name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    const results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }
  const mapController = new MapController(mapCategories.categories)
  const $header = $('.govuk-radios')
  // const $selector = $('input[name=measurements]')
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
    $header.on('change', 'input[name="scenarios-depth"]', function (e) {
      e.preventDefault()
      setCurrent($(this).val())
    })
    $header.on('change', 'input[name="scenarios-velocity"]', function (e) {
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

/* eslint-disable no-unused-vars */
// This function adjusts the descriptions that appear/disappear depending on selected radio button
function handleRadioChange (selected) {
  const scenarioBarDepth = document.getElementById('scenario-container-depth')
  const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
  const extentInfo = document.getElementById('sw-extent-desc-container')
  const depthInfo = document.getElementById('sw-depth-desc-container')
  const velocityInfo = document.getElementById('sw-velocity-desc-container')
  const copyrightBtn = document.getElementById('att-key-copyright-btn')
  const copyrightInfo = document.getElementById('copyright-info-container')
  const olZoom = document.getElementsByClassName('ol-zoom')

  if (selected === 'extent') {
    extentInfo.style.display = 'block'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'none'
    scenarioBarDepth.style.display = 'none'
    scenarioBarVelocity.style.display = 'none'
    copyrightBtn.style.top = 'calc(100vh - 115px)'
    copyrightInfo.style.right = '360px'
    olZoom[0].style.top = 'calc(100% - 145px)'
  }
  if (selected === 'depth') {
    extentInfo.style.display = 'none'
    depthInfo.style.display = 'block'
    velocityInfo.style.display = 'none'
    scenarioBarDepth.style.display = 'block'
    scenarioBarVelocity.style.display = 'none'
    copyrightBtn.style.top = 'calc(100vh - 205px)'
    copyrightInfo.style.right = '310px'
    olZoom[0].style.top = 'calc(100% - 235px)'
  }
  if (selected === 'velocity') {
    extentInfo.style.display = 'none'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'block'
    scenarioBarDepth.style.display = 'none'
    scenarioBarVelocity.style.display = 'block'
    copyrightBtn.style.top = 'calc(100vh - 205px);'
    copyrightInfo.style.right = '310px'
    olZoom[0].style.top = 'calc(100% - 235px)'
  }
}
/* eslint-disable no-unused-vars */

/* eslint-disable no-unused-vars */
function toggleCopyrightInfo () {
  const copyrightInfoContainer = document.getElementsByClassName('defra-map-info__container')
  const scenarioBarDepth = document.getElementById('scenario-container-depth')
  const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
  if (scenarioBarDepth.style.display === 'block') {
    if (!copyrightInfoContainer[0].classList.contains('showing')) {
      scenarioBarDepth.style.display = 'none'
    }
  }
  if (scenarioBarDepth.style.display === 'none') {
    if (copyrightInfoContainer[0].classList.contains('showing')) {
      scenarioBarDepth.style.display = 'block'
      scenarioBarVelocity.style.display = 'none'
    }
  }

  if (scenarioBarVelocity.style.display === 'block') {
    if (!copyrightInfoContainer[0].classList.contains('showing')) {
      scenarioBarVelocity.style.display = 'none'
    }
  }
  if (scenarioBarVelocity.style.display === 'none') {
    if (copyrightInfoContainer[0].classList.contains('showing')) {
      scenarioBarVelocity.style.display = 'block'
      scenarioBarDepth.style.display = 'none'
    }
  }

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

/* eslint-disable no-unused-vars */
function scenarioDisplayUpdate (scenarioBar) {
  const scenariosRadios = document.querySelectorAll(`input[name="scenarios-${scenarioBar}"]`)
  scenariosRadios.forEach(radio => {
    if (radio.checked) {
      const parent = radio.parentNode
      parent.style.borderBottom = '7px solid rgb(29, 112, 184)'
      const scenarioHeading = parent.querySelector('.scenario-heading')
      scenarioHeading.style.textDecoration = 'none'
    } else {
      const parent = radio.parentNode
      parent.style.borderBottom = 'none'
      const scenarioHeading = parent.querySelector('.scenario-heading')
      scenarioHeading.style.textDecoration = 'underline'
      scenarioHeading.style.textDecorationThickness = '2px'
    }
  })
}
/* eslint-enable no-unused-vars */

function selectedOption () {
  const measurementsRadios = document.querySelector('input[name="measurements"]:checked')
  const scenariosRadiosDepth = document.querySelector('input[name="scenarios-depth"]:checked')
  const scenariosRadiosVelocity = document.querySelector('input[name="scenarios-velocity"]:checked')

  const extentRadio = document.getElementById('sw-extent-radio')
  const depthRadio = document.getElementById('sw-depth-radio')
  const velocityRadio = document.getElementById('sw-velocity-radio')

  const mediumRadioDepth = document.getElementById('risk-radio-medium-depth')
  const lowRadioDepth = document.getElementById('risk-radio-low-depth')
  const mediumRadioVelocity = document.getElementById('risk-radio-medium-velocity')
  const lowRadioVelocity = document.getElementById('risk-radio-low-velocity')
  if (extentRadio.checked) {
    return measurementsRadios.value
  }
  if (depthRadio.checked) {
    if (mediumRadioDepth.checked) {
      return mediumRadioDepth.value
    }
    if (lowRadioDepth.checked) {
      return lowRadioDepth.value
    }
    return scenariosRadiosDepth.value
  }
  if (velocityRadio.checked) {
    if (mediumRadioVelocity.checked) {
      return mediumRadioVelocity.value
    }
    if (lowRadioVelocity.checked) {
      return lowRadioVelocity.value
    }
    return scenariosRadiosVelocity.value
  }
  return measurementsRadios.value
}

mapPage()
