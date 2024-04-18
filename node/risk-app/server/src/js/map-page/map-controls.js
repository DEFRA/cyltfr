import { mapControlsConsts } from './constants'

console.log(mapControlsConsts.olZoom[0])

export function selectedOption () {
  // The below const cannot be removed from the file otherwise it breaks reservoirs and rivers and the sea
  const measurementsRadios = document.querySelector('input[name="measurements"]:checked')

  if (mapControlsConsts.extentRadioSw.checked) {
    return measurementsRadios.value
  }
  if (mapControlsConsts.extentRadioReservoirs.checked) {
    return measurementsRadios.value
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
  return measurementsRadios.value
}

export function handleRadioChange (selected, type) {
  if (selected === 'depth') {
    depthRadioChanges()
  }
  if (selected === 'velocity') {
    velocityRadioChanges()
  }

  if (selected === 'extent') {
    if (type === 'reservoirs') {
      extentReservoirChanges()
    }
    if (type === mapControlsConsts.riversAndTheSea) {
      extentRiversAndTheSeaChanges()
    }
    if (type === mapControlsConsts.surfaceWater) {
      extentSurfaceWaterChanges()
    }
    mapControlsConsts.bottomCopyrightContainer.classList.remove('hide')
    mapControlsConsts.topCopyrightContainer.classList.add('hide')
  }
}

export function toggleAdvancedOptions () {
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.keyDisplay.style.display = 'block'
    mapControlsConsts.scenarioSelectionDepth.style.display = 'none'
    showOrHideAdvancedToggleText()
  }

  if (mapControlsConsts.advancedButtonText.textContent.includes('Show')) {
    mapControlsConsts.advancedButtonText.textContent = 'Hide advanced options'
    mapControlsConsts.advancedButtonImage.setAttribute('d', 'M20.515 15.126 12 19.856l-8.515-4.73-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5zM16 4h6v2h-6zm5.484 7.125-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749z')
    mapControlsConsts.velocityContainer.style.display = 'block'
    mapControlsConsts.swContainer.style.display = 'block'
    mapControlsConsts.rsContainer.style.display = 'block'
    mapControlsConsts.rsContainer.style.marginTop = '0px'
    mapControlsConsts.reservoirsContainer.style.marginTop = '0px'
    mapControlsConsts.reservoirsContainer.style.display = 'block'
  } else {
    if (window.location.href.includes('map=SurfaceWater')) {
      mapControlsConsts.swContainer.style.display = 'block'
      mapControlsConsts.velocityContainer.style.display = 'none'
      mapControlsConsts.rsContainer.style.display = 'none'
      mapControlsConsts.reservoirsContainer.style.display = 'none'
      mapControlsConsts.swExtentRadio.checked = true
      handleRadioChange('extent', mapControlsConsts.surfaceWater)
    }
    if (window.location.href.includes('map=RiversOrSea')) {
      mapControlsConsts.swContainer.style.display = 'none'
      mapControlsConsts.velocityContainer.style.display = 'none'
      mapControlsConsts.rsContainer.style.display = 'block'
      mapControlsConsts.rsContainer.style.marginTop = '40px'
      mapControlsConsts.rsExtentRadio.checked = true
      mapControlsConsts.reservoirsContainer.style.display = 'none'
      handleRadioChange('extent', mapControlsConsts.riversAndTheSea)
    }
    if (window.location.href.includes('map=Reservoirs')) {
      mapControlsConsts.swContainer.style.display = 'none'
      mapControlsConsts.velocityContainer.style.display = 'none'
      mapControlsConsts.rsContainer.style.display = 'none'
      mapControlsConsts.reservoirsContainer.style.display = 'block'
      mapControlsConsts.reservoirsContainer.style.marginTop = '40px'
      mapControlsConsts.reservoirsRadio.checked = true
      handleRadioChange('extent', 'reservoirs')
    }
    selectedOption()
    mapControlsConsts.advancedButtonText.textContent = 'Show advanced options'
    mapControlsConsts.advancedButtonImage.setAttribute('d', 'm3.485 15.126-.971 1.748 9 5a1 1 0 0 0 .971 0l9-5-.971-1.748L12 19.856ZM20 8V6h2V4h-2V2h-2v2h-2v2h2v2zM2.513 12.833l9.022 5.04a.995.995 0 0 0 .973.001l8.978-5a1 1 0 0 0-.002-1.749l-9.022-5a1 1 0 0 0-.968-.001l-8.978 4.96a1 1 0 0 0-.003 1.749z')
  }
}

export function showOrHideAdvancedToggleText () {
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.advancedToggleText.classList.remove('hide')
  }
  if (window.innerWidth <= mapControlsConsts.advancedToggleCutoff && mapControlsConsts.keyDisplay.style.display === 'block') {
    mapControlsConsts.advancedToggleText.classList.add('hide')
  }
}

export function openKey () {
  mapControlsConsts.keyDisplay.style.display = 'block'
  mapControlsConsts.openKeyBtn.style.display = 'none'
  mapControlsConsts.scenarioSelectionDepth.style.display = 'none'
  mapControlsConsts.scenarioSelectionVelocity.style.display = 'none'
  showOrHideAdvancedToggleText()
}

export function closeKey () {
  mapControlsConsts.keyDisplay.style.display = 'none'
  if (window.location.href.includes('?')) {
    mapControlsConsts.advancedToggle.style.display = 'block'
  }

  if (mapControlsConsts.depthRadio.checked) {
    mapControlsConsts.scenarioBarDepth.style.display = 'block'
    mapControlsConsts.scenarioSelectionDepth.style.display = 'flex'
    mapControlsConsts.scenarioSelectionDepth.style.top = null
  }

  if (mapControlsConsts.velocityRadio.checked) {
    mapControlsConsts.scenarioBarVelocity.style.display = 'block'
    mapControlsConsts.scenarioSelectionVelocity.style.display = 'flex'
    mapControlsConsts.scenarioSelectionVelocity.style.top = null
  }

  mapControlsConsts.openKeyBtn.style.display = 'block'
  if (mapControlsConsts.scenarioBarDepth.style.display === 'block' || mapControlsConsts.scenarioBarVelocity.style.display === 'block') {
    mapControlsConsts.osLogo.classList.add('os-logo-position-change')
  } else {
    mapControlsConsts.osLogo.classList.remove('os-logo-position-change')
  }

  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.advancedToggleText.classList.remove('hide')
  }
}

function depthRadioChanges () {
  mapControlsConsts.extentInfoRs.style.display = 'none'
  mapControlsConsts.extentInfoReservoirs.style.display = 'none'
  mapControlsConsts.extentInfoSw.style.display = 'none'
  mapControlsConsts.depthInfo.style.display = 'block'
  mapControlsConsts.velocityInfo.style.display = 'none'
  mapControlsConsts.scenarioBarDepth.style.display = 'block'
  mapControlsConsts.scenarioSelectionDepth.style.display = 'flex'
  mapControlsConsts.scenarioBarVelocity.style.display = 'none'
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.scenarioSelectionDepth.style.display = 'none'
    mapControlsConsts.scenarioSelectionVelocity.style.display = 'none'
    mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
    mapControlsConsts.topCopyrightContainer.classList.remove('hide')
  }
  mapControlsConsts.olZoom[0].style.top = 'calc(100% - 200px)'
}

function velocityRadioChanges () {
  mapControlsConsts.extentInfoRs.style.display = 'none'
  mapControlsConsts.extentInfoReservoirs.style.display = 'none'
  mapControlsConsts.extentInfoSw.style.display = 'none'
  mapControlsConsts.depthInfo.style.display = 'none'
  mapControlsConsts.velocityInfo.style.display = 'block'
  mapControlsConsts.scenarioBarDepth.style.display = 'none'
  mapControlsConsts.scenarioBarVelocity.style.display = 'block'
  mapControlsConsts.scenarioSelectionVelocity.style.display = 'flex'
  mapControlsConsts.topCopyrightContainer.classList.add('hide')
  mapControlsConsts.bottomCopyrightContainer.classList.remove('hide')
  mapControlsConsts.scenarioSelectionVelocity.style.display = 'flex'
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth && mapControlsConsts.keyDisplay.style.display === 'block') {
    mapControlsConsts.scenarioSelectionVelocity.style.display = 'none'
  }
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
    mapControlsConsts.topCopyrightContainer.classList.remove('hide')
  }
  if (window.innerWidth <= mapControlsConsts.deviceScreenWidth) {
    mapControlsConsts.bottomCopyrightContainer.classList.add('hide')
    mapControlsConsts.topCopyrightContainer.classList.remove('hide')
  }
  mapControlsConsts.olZoom[0].style.top = 'calc(100% - 200px)'
}

function extentReservoirChanges () {
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

function extentRiversAndTheSeaChanges () {
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

function extentSurfaceWaterChanges () {
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
