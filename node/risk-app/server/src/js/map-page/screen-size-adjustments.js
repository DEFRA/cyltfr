import { showOrHideAdvancedToggleText } from './map-controls'

const scenarioSelectionDepth = document.getElementById('scenario-selection-depth')
const scenarioSelectionVelocity = document.getElementById('scenario-selection-velocity')
const advancedToggle = document.getElementById('advanced-key-button')
const deviceScreenWidth = 768
const zoomBtns = document.getElementsByClassName('ol-control')
const scenarioBarDepth = document.getElementById('scenario-container-depth')
const scenarioBarVelocity = document.getElementById('scenario-container-velocity')
const depthRadio = document.getElementById('sw-depth-radio')
const velocityRadio = document.getElementById('sw-velocity-radio')
const osLogo = document.getElementById('os-logo')
const topCopyrightContainer = document.getElementById('copyright-info-container-top')
const bottomCopyrightContainer = document.getElementById('copyright-info-container-bottom')
const keyDisplay = document.getElementById('map-key')

export function adjustPosition () {
  if ((scenarioBarDepth.style.display === 'block' || scenarioBarVelocity.style.display === 'block') &&
  window.innerWidth <= deviceScreenWidth) {
    osLogo.classList.add('os-logo-position-change')
    bottomCopyrightContainer.classList.add('hide')
    topCopyrightContainer.classList.remove('hide')
  } else {
    osLogo.classList.remove('os-logo-position-change')
    bottomCopyrightContainer.classList.remove('hide')
    topCopyrightContainer.classList.add('hide')
  }

  if (keyDisplay.style.display === 'block' && window.innerWidth <= deviceScreenWidth) {
    scenarioSelectionDepth.style.display = 'none'
    scenarioSelectionVelocity.style.display = 'none'
  } else if (keyDisplay.style.display === 'block' && window.innerWidth > deviceScreenWidth) {
    if (window.location.href.includes('map=RiversOrSea') ||
    window.location.href.includes('map=SurfaceWater') ||
    window.location.href.includes('map=Reservoirs')) {
      advancedToggle.style.display = 'block'
    }
    if (depthRadio.checked) {
      scenarioBarDepth.style.display = 'block'
      scenarioSelectionDepth.style.display = 'flex'
    }
    if (velocityRadio.checked) {
      scenarioBarVelocity.style.display = 'block'
      scenarioSelectionVelocity.style.display = 'flex'
    }
  }

  if (depthRadio.checked && window.innerWidth > deviceScreenWidth) {
    scenarioSelectionDepth.style.display = 'flex'
  } else if (velocityRadio.checked && window.innerWidth > deviceScreenWidth) {
    scenarioSelectionVelocity.style.display = 'flex'
  }

  if ((scenarioBarDepth.style.display === 'block' ||
  scenarioBarVelocity.style.display === 'block') &&
  window.innerWidth <= deviceScreenWidth
  ) {
    zoomBtns[0].style.top = 'calc(100% - 200px)'
  }
  showOrHideAdvancedToggleText()
}
