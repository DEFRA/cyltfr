import { scenarioDisplayUpdate, handleScroll, handleArrowClick } from './scenario-bars.js'
import { openKey, closeKey, showOrHideAdvancedToggleText, toggleAdvancedOptions, handleRadioChange, selectedOption } from './map-controls.js'
import { adjustPosition } from './screen-size-adjustments.js'

const maps = window.maps
const SurfaceWater = 'surface water'
const riversAndTheSea = 'rivers and the sea'
const rightArrow = document.getElementsByClassName('right-scenario-arrow')
const leftArrow = document.getElementsByClassName('left-scenario-arrow')
const scenarioSelectionDepth = document.getElementById('scenario-selection-depth')
const scenarioSelectionVelocity = document.getElementById('scenario-selection-velocity')
const scenarioRadioButtons = document.querySelectorAll('.scenario-radio-button')
const riskMeasurementRadio = document.querySelectorAll('.risk-measurement')
const closeKeyBtn = document.getElementById('close-key')

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

const advancedToggle = document.getElementById('advanced-key-button')
const keyDisplay = document.getElementById('map-key')
const openKeyBtn = document.getElementById('open-key')
const exitMapBtn = document.getElementById('exit-map')
const rightMove = 150
const leftMove = -150

/* global mapCategories */
class MapController {
  constructor (categories) {
    this._categories = categories
  }

  /**
 * setCurrent
 * @param {string} ref The ref of either a category or map. If a category ref is passed, the first map in that category is used.
 */
  setCurrent (ref) {
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
}

function mapPage () {
  getInitialKeyOptions()

  function getParameterByName (name) {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)')
    const results = regex.exec(window.location.search)
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '))
  }
  const measurements = document.querySelectorAll('.govuk-radios__inputs')
  const map = document.getElementById('map')
  const body = document.body

  const easting = parseInt(getParameterByName('easting'), 10)
  const northing = parseInt(getParameterByName('northing'), 10)
  const hasLocation = !!easting

  maps.loadMap((hasLocation && [easting, northing]))

  // This function updates the map to the radio button you select (extent, depth, velocity)
  function setCurrent (ref) {
    const mapController = new MapController(mapCategories.categories)
    mapController.setCurrent(ref)
    const selectedAddressCheckbox = document.getElementById('selected-address-checkbox')
    const showFloodingCheckbox = document.getElementById('display-layers-checkbox')
    const mapReferenceValue = selectedOption()

    if (showFloodingCheckbox.checked) {
      maps.showMap('risk:' + mapReferenceValue.substring(mapReferenceValue.indexOf('_') + 1), selectedAddressCheckbox.checked)
    } else {
      maps.showMap('risk:' + mapReferenceValue.substring(mapReferenceValue.indexOf('_') + 1) + 'DONOTDISPLAY', selectedAddressCheckbox.checked)
    }
  }

  // Default to the first category/map
  maps.onReady(function () {
    measurements.forEach(function (measurement) {
      if (measurement.name === 'measurements') {
        measurement.addEventListener('change', function (event) {
          event.preventDefault()
          setCurrent(event.target.value)
        })
      }
      if (measurement.name === 'scenarios-depth') {
        measurement.addEventListener('change', function (event) {
          event.preventDefault()
          setCurrent(event.target.value)
        })
      }
      if (measurement.name === 'scenarios-velocity') {
        measurement.addEventListener('change', function (event) {
          event.preventDefault()
          setCurrent(event.target.value)
        })
      }
      if (measurement.name === 'map-toggle') {
        measurement.addEventListener('change', function (event) {
          event.preventDefault()
          setCurrent(event.target.value)
        })
      }
    })

    setCurrent(getParameterByName('map'))
  })

  advancedToggle.addEventListener('click', function (event) {
    event.stopPropagation()
    openKey()
    toggleAdvancedOptions()
    selectedOption()
    setCurrent()
  })

  // ensures mouse cursor returns to default if feature was at edge of map
  map.addEventListener('mouseleave', function (e) {
    body.style.cursor = 'default'
  })
}

document.addEventListener('click', function (event) {
  if (keyDisplay.style.display === 'block' && !keyDisplay.contains(event.target)) {
    closeKey()
  }
})

document.addEventListener('DOMContentLoaded', function () {
  scenarioRadioButtons.forEach(function (radio) {
    radio.addEventListener('change', function () {
      const label = document.querySelector(`label[for="${this.id}"]`)
      if (label) {
        label.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    })
  })

  showOrHideAdvancedToggleText()
})

exitMapBtn.addEventListener('click', function () {
  const backLink = exitMapBtn.getAttribute('data-backlink')

  window.location.href = backLink
})

scenarioRadioButtons.forEach(function (radio) {
  if (radio.id.includes('depth')) {
    radio.addEventListener('change', function () {
      scenarioDisplayUpdate('depth')
    })
  } else {
    radio.addEventListener('change', function () {
      scenarioDisplayUpdate('velocity')
    })
  }
})

riskMeasurementRadio.forEach(function (radio) {
  let eventType
  let extentType

  if (radio.id.includes('sw-extent')) {
    eventType = 'extent'
    extentType = SurfaceWater
  } else if (radio.id.includes('sw-depth')) {
    eventType = 'depth'
  } else if (radio.id.includes('sw-velocity')) {
    eventType = 'velocity'
  } else if (radio.id.includes('reservoirs')) {
    eventType = 'extent'
    extentType = 'reservoirs'
  } else if (radio.id.includes('rs-radio')) {
    eventType = 'extent'
    extentType = riversAndTheSea
  } else {
    console.log('No type selected.')
  }

  if (eventType) {
    radio.addEventListener('change', function () {
      handleRadioChange(eventType, extentType)
    })
  }
})

closeKeyBtn.addEventListener('click', closeKey)

handleArrowClick(rightArrow, rightMove)
handleArrowClick(leftArrow, leftMove)

handleScroll(scenarioSelectionDepth, [rightArrow[0], leftArrow[0]])
handleScroll(scenarioSelectionVelocity, [rightArrow[1], leftArrow[1]])

openKeyBtn.addEventListener('click', function (event) {
  event.stopPropagation()
  openKey()
})

function getInitialKeyOptions () {
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
    advancedToggle.classList.add('hide')
    selectedAddressInput.classList.add('hide')
  }
}

window.onresize = adjustPosition
mapPage()
