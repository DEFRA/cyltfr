const deviceScreenWidth = 768
const keyDisplay = document.getElementById('map-key')
const scenarioSelectionDepth = document.getElementById('scenario-selection-depth')
const scenarioSelectionVelocity = document.getElementById('scenario-selection-velocity')
const SurfaceWater = 'surface water'
const riversAndTheSea = 'rivers and the sea'
const advancedToggleText = document.getElementById('advanced-button-text')
const advancedToggleCutoff = 510

function toggleAdvancedOptions () {
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
  const topCopyrightContainer = document.getElementById('copyright-info-container-top')
  const bottomCopyrightContainer = document.getElementById('copyright-info-container-bottom')

  if (selected === 'depth') {
    extentInfoRs.style.display = 'none'
    extentInfoReservoirs.style.display = 'none'
    extentInfoSw.style.display = 'none'
    depthInfo.style.display = 'block'
    velocityInfo.style.display = 'none'
    scenarioBarDepth.style.display = 'block'
    scenarioSelectionDepth.style.display = 'flex'
    scenarioBarVelocity.style.display = 'none'
    if (window.innerWidth <= deviceScreenWidth) {
      scenarioSelectionDepth.style.display = 'none'
      scenarioSelectionVelocity.style.display = 'none'
      bottomCopyrightContainer.classList.add('hide')
      topCopyrightContainer.classList.remove('hide')
    }
    olZoom[0].style.top = 'calc(100% - 200px)'
  }
  if (selected === 'velocity') {
    extentInfoRs.style.display = 'none'
    extentInfoReservoirs.style.display = 'none'
    extentInfoSw.style.display = 'none'
    depthInfo.style.display = 'none'
    velocityInfo.style.display = 'block'
    scenarioBarDepth.style.display = 'none'
    scenarioBarVelocity.style.display = 'block'
    scenarioSelectionVelocity.style.display = 'flex'
    topCopyrightContainer.classList.add('hide')
    bottomCopyrightContainer.classList.remove('hide')
    scenarioSelectionVelocity.style.display = 'flex'
    if (window.innerWidth <= deviceScreenWidth && keyDisplay.style.display === 'block') {
      scenarioSelectionVelocity.style.display = 'none'
    }
    if (window.innerWidth <= deviceScreenWidth) {
      bottomCopyrightContainer.classList.add('hide')
      topCopyrightContainer.classList.remove('hide')
    }
    if (window.innerWidth <= deviceScreenWidth) {
      bottomCopyrightContainer.classList.add('hide')
      topCopyrightContainer.classList.remove('hide')
    }
    olZoom[0].style.top = 'calc(100% - 200px)'
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
      olZoom[0].style.top = 'calc(100% - 102px)'
      boundaryContainer.style.display = 'none'
    }
    if (type === riversAndTheSea) {
      extentInfoRs.style.display = 'block'
      extentInfoReservoirs.style.display = 'none'
      extentInfoSw.style.display = 'none'
      depthInfo.style.display = 'none'
      velocityInfo.style.display = 'none'
      scenarioBarDepth.style.display = 'none'
      scenarioBarVelocity.style.display = 'none'
      olZoom[0].style.top = 'calc(100% - 102px)'
      boundaryContainer.style.display = 'none'
    }
    if (type === SurfaceWater) {
      extentInfoRs.style.display = 'none'
      extentInfoReservoirs.style.display = 'none'
      extentInfoSw.style.display = 'block'
      depthInfo.style.display = 'none'
      velocityInfo.style.display = 'none'
      scenarioBarDepth.style.display = 'none'
      scenarioBarVelocity.style.display = 'none'
      olZoom[0].style.top = 'calc(100% - 102px)'
      boundaryContainer.style.display = 'block'
    }
    bottomCopyrightContainer.classList.remove('hide')
    topCopyrightContainer.classList.add('hide')
  }
}
function showOrHideAdvancedToggleText () {
  if (window.innerWidth <= deviceScreenWidth) {
    advancedToggleText.classList.remove('hide')
  }
  if (window.innerWidth <= advancedToggleCutoff && keyDisplay.style.display === 'block') {
    advancedToggleText.classList.add('hide')
  }
}

module.exports = {
  toggleAdvancedOptions,
  selectedOption,
  handleRadioChange,
  showOrHideAdvancedToggleText
}
