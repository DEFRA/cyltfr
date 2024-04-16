const advancedToggle = document.getElementById('advanced-key-button')
const boundaryContainer = document.getElementById('boundary-container')
const closeKeyBtn = document.getElementById('close-key')
const exitMapBtn = document.getElementById('exit-map')
const extentInfoReservoirs = document.getElementById('reservoirs-extent-desc-container')
const extentInfoRs = document.getElementById('rs-extent-desc-container')
const extentInfoSw = document.getElementById('sw-extent-desc-container')
const keyDisplay = document.getElementById('map-key')
const leftArrow = document.getElementsByClassName('left-scenario-arrow')
const maps = window.maps
const openKeyBtn = document.getElementById('open-key')
const reservoirsContainer = document.getElementById('reservoirs-section-container')
const reservoirsRadio = document.getElementById('reservoirs-radio')
const rightArrow = document.getElementsByClassName('right-scenario-arrow')
const riskMeasurementRadio = document.querySelectorAll('.risk-measurement')
const riversAndTheSea = 'rivers and the sea'
const rsContainer = document.getElementById('rs-section-container')
const rsRadio = document.getElementById('rs-radio')
const selectedAddressInput = document.getElementById('selected-address')
const scenarioRadioButtons = document.querySelectorAll('.scenario-radio-button')
const scenarioSelectionDepth = document.getElementById('scenario-selection-depth')
const scenarioSelectionVelocity = document.getElementById('scenario-selection-velocity')
const surfaceWater = 'surface water'
const swContainer = document.getElementById('sw-section-container')
const velocityContainer = document.getElementById('sw-velocity-section-container')

const rightMove = 150
const leftMove = -150

export const mapPageConsts = {
  advancedToggle,
  boundaryContainer,
  closeKeyBtn,
  exitMapBtn,
  extentInfoReservoirs,
  extentInfoRs,
  extentInfoSw,
  keyDisplay,
  leftArrow,
  maps,
  openKeyBtn,
  reservoirsContainer,
  reservoirsRadio,
  rightArrow,
  riskMeasurementRadio,
  riversAndTheSea,
  rsContainer,
  rsRadio,
  selectedAddressInput,
  scenarioRadioButtons,
  scenarioSelectionDepth,
  scenarioSelectionVelocity,
  surfaceWater,
  swContainer,
  velocityContainer,
  rightMove,
  leftMove
}
