import { showOrHideAdvancedToggleText } from './map-controls'
import { screenAdjustConsts } from './constants'

export function adjustPosition () {
  adjustLogoAndCopyright()
  keyToggleAdjustments()
  scenarioBarAdjustments()
  zoomBtnAdjustments()
  showOrHideAdvancedToggleText()
}

function adjustLogoAndCopyright () {
  if ((screenAdjustConsts.scenarioBarDepth.classList.contains('hide') || screenAdjustConsts.scenarioBarVelocity.classList.contains('hide')) &&
  window.innerWidth <= screenAdjustConsts.deviceScreenWidth) {
    screenAdjustConsts.osLogo.classList.add('os-logo-position-change')
    screenAdjustConsts.bottomCopyrightContainer.classList.add('hide')
    screenAdjustConsts.topCopyrightContainer.classList.remove('hide')
  } else {
    screenAdjustConsts.osLogo.classList.remove('os-logo-position-change')
    screenAdjustConsts.bottomCopyrightContainer.classList.remove('hide')
    screenAdjustConsts.topCopyrightContainer.classList.add('hide')
  }
}

function keyToggleAdjustments () {
  if (!screenAdjustConsts.keyDisplay.classList.contains('hide') && window.innerWidth <= screenAdjustConsts.deviceScreenWidth) {
    screenAdjustConsts.scenarioSelectionDepth.style.display = 'none'
    screenAdjustConsts.scenarioSelectionVelocity.style.display = 'none'
  } else if (!screenAdjustConsts.keyDisplay.classList.contains('hide') && window.innerWidth > screenAdjustConsts.deviceScreenWidth) {
    if (window.location.href.includes('map=RiversOrSea') ||
    window.location.href.includes('map=SurfaceWater') ||
    window.location.href.includes('map=Reservoirs')) {
      screenAdjustConsts.advancedToggle.style.display = 'block'
    }
    if (screenAdjustConsts.depthRadio.checked) {
      screenAdjustConsts.scenarioBarDepth.style.display = 'block'
      screenAdjustConsts.scenarioSelectionDepth.classList.remove('hide')
      screenAdjustConsts.scenarioSelectionDepth.style.display = 'flex'
    }
    if (screenAdjustConsts.velocityRadio.checked) {
      screenAdjustConsts.scenarioBarVelocity.style.display = 'block'
      screenAdjustConsts.scenarioSelectionVelocity.classList.remove('hide')
      screenAdjustConsts.scenarioSelectionVelocity.style.display = 'flex'
    }
  }
}

function scenarioBarAdjustments () {
  if (screenAdjustConsts.depthRadio.checked && window.innerWidth > screenAdjustConsts.deviceScreenWidth) {
    screenAdjustConsts.scenarioSelectionDepth.classList.remove('hide')
    screenAdjustConsts.scenarioSelectionDepth.style.display = 'flex'
  } else if (screenAdjustConsts.velocityRadio.checked && window.innerWidth > screenAdjustConsts.deviceScreenWidth) {
    screenAdjustConsts.scenarioSelectionVelocity.classList.remove('hide')
    screenAdjustConsts.scenarioSelectionVelocity.style.display = 'flex'
  }
}

function zoomBtnAdjustments () {
  if ((screenAdjustConsts.scenarioBarDepth.style.display === 'block' ||
  screenAdjustConsts.scenarioBarVelocity.style.display === 'block') &&
  window.innerWidth <= screenAdjustConsts.deviceScreenWidth
  ) {
    screenAdjustConsts.zoomBtns[0].style.top = 'calc(100% - 200px)'
  }
}
