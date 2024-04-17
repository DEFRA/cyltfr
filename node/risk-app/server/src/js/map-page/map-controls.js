import { mapControlsConsts } from './constants'
const openKeyBtn = document.getElementById('open-key')
const scenarioSelectionDepth = document.getElementById('scenario-selection-depth')
const scenarioSelectionVelocity = document.getElementById('scenario-selection-velocity')
const advancedToggle = document.getElementById('advanced-key-button')
const advancedToggleText = document.getElementById('advanced-button-text')
const deviceScreenWidth = 768
const advancedToggleCutoff = 510
const advancedButtonText = document.getElementById('advanced-button-text')
const advancedButtonImage = document.getElementById('advanced-button-image')
const velocityContainer = document.getElementById('sw-velocity-section-container')
const swContainer = document.getElementById('sw-section-container')
const rsContainer = document.getElementById('rs-section-container')
const reservoirsContainer = document.getElementById('reservoirs-section-container')
const swExtentRadio = document.getElementById('sw-extent-radio')
const rsExtentRadio = document.getElementById('rs-radio')
const reservoirsRadio = document.getElementById('reservoirs-radio')
const SurfaceWater = 'surface water'
const riversAndTheSea = 'rivers and the sea'

export function selectedOption () {
  if (mapControlsConsts.extentRadioSw.checked) {
    return mapControlsConsts.measurementsRadios.value
  }
  if (mapControlsConsts.extentRadioReservoirs.checked) {
    return mapControlsConsts.measurementsRadios.value
  }
  if (mapControlsConsts.depthRadio.checked) {
    if (mapControlsConsts.mediumRadioDepth.checked) {
      return mapControlsConsts.mediumRadioDepth.value
    }
    if (mapControlsConsts.lowRadioDepth.checked) {
      return mapControlsConsts.lowRadioDepth.value
    }
    return mapControlsConsts.scenariosRadiosDepth.value
  }
  if (mapControlsConsts.velocityRadio.checked) {
    if (mapControlsConsts.mediumRadioVelocity.checked) {
      return mapControlsConsts.mediumRadioVelocity.value
    }
    if (mapControlsConsts.lowRadioVelocity.checked) {
      return mapControlsConsts.lowRadioVelocity.value
    }
    return mapControlsConsts.scenariosRadiosVelocity.value
  }
  return mapControlsConsts.measurementsRadios.value
}

export function handleRadioChange (selected, type) {
  if (selected === 'depth') {
    mapControlsConsts.extentInfoRs.style.display = 'none'
    mapControlsConsts.extentInfoReservoirs.style.display = 'none'
    mapControlsConsts.extentInfoSw.style.display = 'none'
    mapControlsConsts.depthInfo.style.display = 'block'
    mapControlsConsts.velocityInfo.style.display = 'none'
    mapControlsConsts.scenarioBarDepth.style.display = 'block'
    scenarioSelectionDepth.style.display = 'flex'
    mapControlsConsts.scenarioBarVelocity.style.display = 'none'
    if (window.innerWidth <= deviceScreenWidth) {
      scenarioSelectionDepth.style.display = 'none'
      scenarioSelectionVelocity.style.display = 'none'
      mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
      mapControlsConsts.topCopyrightContainer.classList.remove('hide')
    }
    mapControlsConsts.olZoom[0].style.top = 'calc(100% - 200px)'
  }
  if (selected === 'velocity') {
    mapControlsConsts.extentInfoRs.style.display = 'none'
    mapControlsConsts.extentInfoReservoirs.style.display = 'none'
    mapControlsConsts.extentInfoSw.style.display = 'none'
    mapControlsConsts.depthInfo.style.display = 'none'
    mapControlsConsts.velocityInfo.style.display = 'block'
    mapControlsConsts.scenarioBarDepth.style.display = 'none'
    mapControlsConsts.scenarioBarVelocity.style.display = 'block'
    scenarioSelectionVelocity.style.display = 'flex'
    mapControlsConsts.topCopyrightContainer.classList.add('hide')
    mapControlsConsts.bottomCopyrightContainer.classList.remove('hide')
    scenarioSelectionVelocity.style.display = 'flex'
    if (window.innerWidth <= deviceScreenWidth && mapControlsConsts.keyDisplay.style.display === 'block') {
      scenarioSelectionVelocity.style.display = 'none'
    }
    if (window.innerWidth <= deviceScreenWidth) {
      mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
      mapControlsConsts.topCopyrightContainer.classList.remove('hide')
    }
    if (window.innerWidth <= deviceScreenWidth) {
      mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
      mapControlsConsts.topCopyrightContainer.classList.remove('hide')
    }
    mapControlsConsts.olZoom[0].style.top = 'calc(100% - 200px)'
  }

  if (selected === 'extent') {
    if (type === 'reservoirs') {
      mapControlsConsts.extentInfoRs.style.display = 'none'
      mapControlsConsts.extentInfoReservoirs.style.display = 'block'
      mapControlsConsts.extentInfoSw.style.display = 'none'
      mapControlsConsts.depthInfo.style.display = 'none'
      mapControlsConsts.velocityInfo.style.display = 'none'
      mapControlsConsts.scenarioBarDepth.style.display = 'none'
      mapControlsConsts.scenarioBarVelocity.style.display = 'none'
      mapControlsConsts.olZoom[0].style.top = 'calc(100% - 102px)'
      mapControlsConsts.boundaryContainer.style.display = 'none'
    }
    if (type === riversAndTheSea) {
      mapControlsConsts.extentInfoRs.style.display = 'block'
      mapControlsConsts.extentInfoReservoirs.style.display = 'none'
      mapControlsConsts.extentInfoSw.style.display = 'none'
      mapControlsConsts.depthInfo.style.display = 'none'
      mapControlsConsts.velocityInfo.style.display = 'none'
      mapControlsConsts.scenarioBarDepth.style.display = 'none'
      mapControlsConsts.scenarioBarVelocity.style.display = 'none'
      mapControlsConsts.olZoom[0].style.top = 'calc(100% - 102px)'
      mapControlsConsts.boundaryContainer.style.display = 'none'
    }
    if (type === SurfaceWater) {
      mapControlsConsts.extentInfoRs.style.display = 'none'
      mapControlsConsts.extentInfoReservoirs.style.display = 'none'
      mapControlsConsts.extentInfoSw.style.display = 'block'
      mapControlsConsts.depthInfo.style.display = 'none'
      mapControlsConsts.velocityInfo.style.display = 'none'
      mapControlsConsts.scenarioBarDepth.style.display = 'none'
      mapControlsConsts.scenarioBarVelocity.style.display = 'none'
      mapControlsConsts.olZoom[0].style.top = 'calc(100% - 102px)'
      mapControlsConsts.boundaryContainer.style.display = 'block'
    }
    mapControlsConsts.bottomCopyrightContainer.classList.remove('hide')
    mapControlsConsts.topCopyrightContainer.classList.add('hide')
  }
}

export function toggleAdvancedOptions () {
  if (window.innerWidth <= deviceScreenWidth) {
    mapControlsConsts.keyDisplay.style.display = 'block'
    scenarioSelectionDepth.style.display = 'none'
    showOrHideAdvancedToggleText()
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
  } else {
    if (window.location.href.includes('map=SurfaceWater')) {
      swContainer.style.display = 'block'
      velocityContainer.style.display = 'none'
      rsContainer.style.display = 'none'
      reservoirsContainer.style.display = 'none'
      swExtentRadio.checked = true
      handleRadioChange('extent', SurfaceWater)
    }
    if (window.location.href.includes('map=RiversOrSea')) {
      swContainer.style.display = 'none'
      velocityContainer.style.display = 'none'
      rsContainer.style.display = 'block'
      rsContainer.style.marginTop = '40px'
      rsExtentRadio.checked = true
      reservoirsContainer.style.display = 'none'
      handleRadioChange('extent', riversAndTheSea)
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

export function showOrHideAdvancedToggleText () {
  if (window.innerWidth <= deviceScreenWidth) {
    advancedToggleText.classList.remove('hide')
  }
  if (window.innerWidth <= advancedToggleCutoff && mapControlsConsts.keyDisplay.style.display === 'block') {
    advancedToggleText.classList.add('hide')
  }
}

export function openKey () {
  mapControlsConsts.keyDisplay.style.display = 'block'
  openKeyBtn.style.display = 'none'
  scenarioSelectionDepth.style.display = 'none'
  scenarioSelectionVelocity.style.display = 'none'
  showOrHideAdvancedToggleText()
}

export function closeKey () {
  mapControlsConsts.keyDisplay.style.display = 'none'
  if (window.location.href.includes('?')) {
    advancedToggle.style.display = 'block'
  }

  if (mapControlsConsts.depthRadio.checked) {
    mapControlsConsts.scenarioBarDepth.style.display = 'block'
    scenarioSelectionDepth.style.display = 'flex'
    scenarioSelectionDepth.style.top = null
  }

  if (mapControlsConsts.velocityRadio.checked) {
    mapControlsConsts.scenarioBarVelocity.style.display = 'block'
    scenarioSelectionVelocity.style.display = 'flex'
    scenarioSelectionVelocity.style.top = null
  }

  openKeyBtn.style.display = 'block'
  if (mapControlsConsts.scenarioBarDepth.style.display === 'block' || mapControlsConsts.scenarioBarVelocity.style.display === 'block') {
    mapControlsConsts.osLogo.classList.add('os-logo-position-change')
  } else {
    mapControlsConsts.osLogo.classList.remove('os-logo-position-change')
  }

  if (window.innerWidth <= deviceScreenWidth) {
    advancedToggleText.classList.remove('hide')
  }
}
