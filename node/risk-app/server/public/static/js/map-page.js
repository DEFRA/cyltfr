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
  getInitialKeyOptions()

  function getParameterByName (name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    const results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }
  const $header = $('.govuk-radios')
  const $advancedHeader = $('.defra-map-controls')
  const $map = $('#map')
  const $body = $(document.body)

  const easting = parseInt(getParameterByName('easting'), 10)
  const northing = parseInt(getParameterByName('northing'), 10)
  const hasLocation = !!easting
  const maps = window.maps

  maps.loadMap((hasLocation && [easting, northing]))

  // Default to the first category/map
  maps.onReady(function () {
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
    $header.on('change', 'input[name="map-toggle"]', function (e) {
      e.preventDefault()
      setCurrent($(this).val())
    })
    $advancedHeader.on('click', '#advanced-key-button', function (e) {
      toggleAdvancedOptions()
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

const advancedToggle = document.getElementById('advanced-key-button')
const keyDisplay = document.getElementById('map-key')
const openKeyBtn = document.getElementById('open-key')
const deviceScreenWidth = 768

document.addEventListener('click', function (event) {
  if (keyDisplay.style.display === 'block' && !keyDisplay.contains(event.target)) {
    closeKey()
  }
})

openKeyBtn.addEventListener('click', function (event) {
  event.stopPropagation()
  openKey()
})

advancedToggle.addEventListener('click', function (event) {
  event.stopPropagation()
  openKey()
  toggleAdvancedOptions()
  selectedOption()
  setCurrent()
})

// This function updates the map to the radio button you select (extent, depth, velocity)
function setCurrent (ref) {
  const maps = window.maps
  const mapController = new MapController(mapCategories.categories)
  mapController.setCurrent(ref)
  const selectedAddressCheckbox = document.getElementById('selected-address-checkbox')
  const showFloodingCheckbox = document.getElementById('display-layers-checkbox')
  const mapReferenceValue = selectedOption()

  if (showFloodingCheckbox.checked) {
    maps.showMap('risk:' + mapReferenceValue.substring(mapReferenceValue.indexOf('_') + 1), selectedAddressCheckbox.checked)
  } else {
    maps.showMap(undefined, selectedAddressCheckbox.checked)
  }
}

function toggleAdvancedOptions () {
  const scenariosSelectorDepth = document.getElementById('scenario-selection-depth')
  const advancedButtonText = document.getElementById('advanced-button-text')
  const advancedButtonImage = document.getElementById('advanced-button-image')
  const velocityContainer = document.getElementById('sw-velocity-section-container')
  const swContainer = document.getElementById('sw-section-container')
  const rsContainer = document.getElementById('rs-section-container')
  const reservoirsContainer = document.getElementById('reservoirs-section-container')
  const swExtentRadio = document.getElementById('sw-extent-radio')
  const rsExtentRadio = document.getElementById('rs-radio')
  const reservoirsRadio = document.getElementById('reservoirs-radio')

  if (window.innerWidth <= deviceScreenWidth) {
    keyDisplay.style.display = 'block'
    // openKeyBtn.style.display = 'none'
    scenariosSelectorDepth.style.display = 'none'
    // advancedToggle.style.display = 'none'
  }

  if (advancedButtonText.textContent.includes('Show')) {
    advancedButtonText.textContent = 'Hide advanced options'
    advancedButtonImage.setAttribute('d', 'M20.515 15.126 12 19.856l-8.515-4.73-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5zM16 4h6v2h-6zm5.484 7.125-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749z')
    velocityContainer.style.display = 'block'
    swContainer.style.display = 'block'
    rsContainer.style.display = 'block'
    rsContainer.style.marginTop = '0px'
    reservoirsContainer.style.marginTop = '0px'
    reservoirsContainer.style.display = 'block'
    // openKeyBtn.style.left = '222px'
  } else {
    if (window.location.href.includes('map=SurfaceWater')) {
      swContainer.style.display = 'block'
      velocityContainer.style.display = 'none'
      rsContainer.style.display = 'none'
      reservoirsContainer.style.display = 'none'
      swExtentRadio.checked = true
      handleRadioChange('extent', 'surface water')
    }
    if (window.location.href.includes('map=RiversOrSea')) {
      swContainer.style.display = 'none'
      velocityContainer.style.display = 'none'
      rsContainer.style.display = 'block'
      rsContainer.style.marginTop = '40px'
      rsExtentRadio.checked = true
      reservoirsContainer.style.display = 'none'
      handleRadioChange('extent', 'rivers and the sea')
    }
    if (window.location.href.includes('map=Reservoirs')) {
      swContainer.style.display = 'none'
      velocityContainer.style.display = 'none'
      rsContainer.style.display = 'none'
      reservoirsContainer.style.display = 'block'
      reservoirsContainer.style.marginTop = '40px'
      reservoirsRadio.checked = true
      handleRadioChange('extent', 'reservoirs')
    }
    selectedOption()
    advancedButtonText.textContent = 'Show advanced options'
    advancedButtonImage.setAttribute('d', 'm3.485 15.126-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.971-1.748L12 19.856ZM20 8V6h2V4h-2V2h-2v2h-2v2h2v2zM2.513 12.833l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749l-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749z')
  }
}

function openKey () {
  const scenariosSelectorDepth = document.getElementById('scenario-selection-depth')
  const scenariosSelectorVelocity = document.getElementById('scenario-selection-velocity')

  keyDisplay.style.display = 'block'
  openKeyBtn.style.display = 'none'
  scenariosSelectorDepth.style.display = 'none'
  scenariosSelectorVelocity.style.display = 'none'
  if (window.innerWidth <= deviceScreenWidth) {
    // advancedToggle.style.display = 'none'
    scenariosSelectorDepth.style.top = ' calc(100vh - 145px)'
    scenariosSelectorVelocity.style.top = ' calc(100vh - 145px)'
  }
}

function getInitialKeyOptions () {
  const velocityContainer = document.getElementById('sw-velocity-section-container')
  const swContainer = document.getElementById('sw-section-container')
  const rsContainer = document.getElementById('rs-section-container')
  const reservoirsContainer = document.getElementById('reservoirs-section-container')
  const rsRadio = document.getElementById('rs-radio')
  const reservoirsRadio = document.getElementById('reservoirs-radio')
  const extentInfoRs = document.getElementById('rs-extent-desc-container')
  const extentInfoReservoirs = document.getElementById('reservoirs-extent-desc-container')
  const extentInfoSw = document.getElementById('sw-extent-desc-container')
  const selectedAddressInput = document.getElementById('selected-address')
  const boundaryContainer = document.getElementById('boundary-container')

  if (window.location.href.includes('map=SurfaceWater')) {
    velocityContainer.style.display = 'none'
    rsContainer.style.display = 'none'
    reservoirsContainer.style.display = 'none'
  } else if (window.location.href.includes('map=RiversOrSea')) {
    swContainer.style.display = 'none'
    extentInfoSw.style.display = 'none'
    rsContainer.style.display = 'block'
    rsContainer.style.marginTop = '40px'
    rsRadio.checked = true
    extentInfoRs.style.display = 'block'
    reservoirsContainer.style.display = 'none'
    boundaryContainer.style.display = 'none'
  } else if (window.location.href.includes('map=Reservoirs')) {
    swContainer.style.display = 'none'
    extentInfoSw.style.display = 'none'
    rsContainer.style.display = 'none'
    reservoirsContainer.style.display = 'block'
    reservoirsContainer.style.marginTop = '40px'
    reservoirsRadio.checked = true
    extentInfoReservoirs.style.display = 'block'
    boundaryContainer.style.display = 'none'
  } else {
    advancedToggle.style.display = 'none'
    selectedAddressInput.style.display = 'none'
  }
}

/* eslint-disable no-unused-vars */
// This function adjusts the descriptions that appear/disappear depending on selected radio button
function handleRadioChange (selected, type) {
  const scenarioBarDepth = document.getElementById('scenario-container-depth')
  const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
  const extentInfoRs = document.getElementById('rs-extent-desc-container')
  const extentInfoReservoirs = document.getElementById('reservoirs-extent-desc-container')
  const extentInfoSw = document.getElementById('sw-extent-desc-container')
  const depthInfo = document.getElementById('sw-depth-desc-container')
  const velocityInfo = document.getElementById('sw-velocity-desc-container')
  const boundaryContainer = document.getElementById('boundary-container')
  const olZoom = document.getElementsByClassName('ol-zoom')
  const scenariosSelectorDepth = document.getElementById('scenario-selection-depth')
  const scenariosSelectorVelocity = document.getElementById('scenario-selection-velocity')

  if (selected === 'depth') {
    extentInfoRs.style.display = 'none'
    extentInfoReservoirs.style.display = 'none'
    extentInfoSw.style.display = 'none'
    depthInfo.style.display = 'block'
    velocityInfo.style.display = 'none'
    scenarioBarDepth.style.display = 'block'
    scenariosSelectorDepth.style.display = 'flex'
    scenarioBarVelocity.style.display = 'none'
    if (window.innerWidth <= deviceScreenWidth) {
      scenariosSelectorDepth.style.display = 'none'
      scenariosSelectorVelocity.style.display = 'none'
    }
    olZoom[0].style.top = 'calc(100% - 235px)'
  }
  if (selected === 'velocity') {
    extentInfoRs.style.display = 'none'
    extentInfoReservoirs.style.display = 'none'
    extentInfoSw.style.display = 'none'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'block'
    scenarioBarDepth.style.display = 'none'
    scenarioBarVelocity.style.display = 'block'
    scenariosSelectorVelocity.style.display = 'flex'
    if (window.innerWidth <= deviceScreenWidth && keyDisplay.style.display === 'block') {
      scenariosSelectorDepth.style.top = ' calc(100vh - 145px)'
      scenariosSelectorVelocity.style.top = ' calc(100vh - 145px)'
      scenariosSelectorVelocity.style.display = 'none'
    } else {
      scenariosSelectorVelocity.style.display = 'flex'
    }
    olZoom[0].style.top = 'calc(100% - 235px)'
  }

  if (selected === 'extent') {
    if (type === 'reservoirs') {
      extentInfoRs.style.display = 'none'
      extentInfoReservoirs.style.display = 'block'
      extentInfoSw.style.display = 'none'
      depthInfo.style.display = 'none'
      velocityInfo.style.display = 'none'
      scenarioBarDepth.style.display = 'none'
      scenarioBarVelocity.style.display = 'none'
      olZoom[0].style.top = 'calc(100% - 155px)'
      boundaryContainer.style.display = 'none'
    }
    if (type === 'rivers and the sea') {
      extentInfoRs.style.display = 'block'
      extentInfoReservoirs.style.display = 'none'
      extentInfoSw.style.display = 'none'
      depthInfo.style.display = 'none'
      velocityInfo.style.display = 'none'
      scenarioBarDepth.style.display = 'none'
      scenarioBarVelocity.style.display = 'none'
      olZoom[0].style.top = 'calc(100% - 155px)'
      boundaryContainer.style.display = 'none'
    }
    if (type === 'surface water') {
      extentInfoRs.style.display = 'none'
      extentInfoReservoirs.style.display = 'none'
      extentInfoSw.style.display = 'block'
      depthInfo.style.display = 'none'
      velocityInfo.style.display = 'none'
      scenarioBarDepth.style.display = 'none'
      scenarioBarVelocity.style.display = 'none'
      olZoom[0].style.top = 'calc(100% - 155px)'
      boundaryContainer.style.display = 'block'
    }
  }
}

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

function selectedOption () {
  const measurementsRadios = document.querySelector('input[name="measurements"]:checked')
  const scenariosRadiosDepth = document.querySelector('input[name="scenarios-depth"]:checked')
  const scenariosRadiosVelocity = document.querySelector('input[name="scenarios-velocity"]:checked')

  const extentRadioReservoirs = document.getElementById('reservoirs-radio')
  const extentRadioSw = document.getElementById('sw-extent-radio')
  const depthRadio = document.getElementById('sw-depth-radio')
  const velocityRadio = document.getElementById('sw-velocity-radio')

  const mediumRadioDepth = document.getElementById('risk-radio-medium-depth')
  const lowRadioDepth = document.getElementById('risk-radio-low-depth')
  const mediumRadioVelocity = document.getElementById('risk-radio-medium-velocity')
  const lowRadioVelocity = document.getElementById('risk-radio-low-velocity')
  if (extentRadioSw.checked) {
    return measurementsRadios.value
  }
  if (extentRadioReservoirs.checked) {
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

function closeKey () {
  const scenarioBarDepth = document.getElementById('scenario-container-depth')
  const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
  const scenariosSelectorDepth = document.getElementById('scenario-selection-depth')
  const scenariosSelectorVelocity = document.getElementById('scenario-selection-velocity')
  const depthRadio = document.getElementById('sw-depth-radio')
  const velocityRadio = document.getElementById('sw-velocity-radio')
  const advancedButtonText = document.getElementById('advanced-button-text')

  keyDisplay.style.display = 'none'
  if (window.location.href.includes('?')) {
    advancedToggle.style.display = 'block'
  }

  if (depthRadio.checked) {
    scenarioBarDepth.style.display = 'block'
    scenariosSelectorDepth.style.display = 'flex'
    scenariosSelectorDepth.style.top = null
  }

  if (velocityRadio.checked) {
    scenarioBarVelocity.style.display = 'block'
    scenariosSelectorVelocity.style.display = 'flex'
    scenariosSelectorVelocity.style.top = null
  }

  openKeyBtn.style.display = 'block'
  // if (scenarioBarDepth.style.display === 'block' || scenarioBarVelocity.style.display === 'block') {
  //   openKeyBtn.style.top = 'calc(100vh - 140px)'
  // } else {
  //   openKeyBtn.style.top = 'calc(100vh - 60px)'
  // }
  // openKeyBtn.style.display = 'flex'
  // if (window.location.search === '') {
  //   openKeyBtn.style.left = '-20px'
  // } else {
  //   if (advancedButtonText.textContent.includes('Hide')) {
  //     openKeyBtn.style.display = 'none'
  //   } else {
  //     openKeyBtn.style.left = '229px'
  //   }
  // }
}

/* eslint-enable no-unused-vars */
function adjustPosition () {
  const zoomBtns = document.getElementsByClassName('ol-control')
  const scenarioBarDepth = document.getElementById('scenario-container-depth')
  const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
  const scenariosSelectorDepth = document.getElementById('scenario-selection-depth')
  const scenariosSelectorVelocity = document.getElementById('scenario-selection-velocity')
  const depthRadio = document.getElementById('sw-depth-radio')
  const velocityRadio = document.getElementById('sw-velocity-radio')

  if (window.innerWidth > deviceScreenWidth) {
    scenariosSelectorDepth.style.top = 'calc(100vh - 145px)'
    scenariosSelectorVelocity.style.top = 'calc(100vh - 145px)'
  }

  if (keyDisplay.style.display === 'block' && window.innerWidth <= deviceScreenWidth) {
    scenariosSelectorDepth.style.display = 'none'
    scenariosSelectorVelocity.style.display = 'none'
    // advancedToggle.style.display = 'none'
  } else if (keyDisplay.style.display === 'block' && window.innerWidth > deviceScreenWidth) {
    if (window.location.href.includes('map=RiversOrSea') ||
    window.location.href.includes('map=SurfaceWater') ||
    window.location.href.includes('map=Reservoirs')) {
      advancedToggle.style.display = 'block'
    }
    if (depthRadio.checked) {
      scenarioBarDepth.style.display = 'block'
      scenariosSelectorDepth.style.display = 'flex'
    }
    if (velocityRadio.checked) {
      scenarioBarVelocity.style.display = 'block'
      scenariosSelectorVelocity.style.display = 'flex'
    }
  }

  if (depthRadio.checked && window.innerWidth > deviceScreenWidth) {
    scenariosSelectorDepth.style.display = 'flex'
  } else if (velocityRadio.checked && window.innerWidth > deviceScreenWidth) {
    scenariosSelectorVelocity.style.display = 'flex'
  }

  if (keyDisplay.style.display === 'none' && window.innerWidth <= deviceScreenWidth) {
    scenariosSelectorDepth.style.top = 'calc(100vh - 190px)'
    scenariosSelectorVelocity.style.top = 'calc(100vh - 190px)'
  }

  if ((scenarioBarDepth.style.display === 'block' ||
  scenarioBarVelocity.style.display === 'block') &&
  window.innerWidth <= deviceScreenWidth
  ) {
    zoomBtns[0].style.top = 'calc(100% - 235px)'
    // openKeyBtn.style.top = 'calc(100vh - 160px)'
  }

  if (window.innerWidth > deviceScreenWidth) {
    zoomBtns[0].style.top = 'calc(100% - 145px)'
  }
}

window.onresize = adjustPosition
mapPage()
