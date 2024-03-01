import { holdingCommentBoundaries, llfaBoundaries } from './boundaries.js'
import { createOverrideRadio } from './create-override-radio.js'
import { createRadio } from './create-radio.js'
import { createTextarea } from './create-text-area.js'
// The form's inputs are not required, but they should be if visible on the page (the elements when hidden shouldn't be required)
const createCommentSchema = () => {
  const geometry = window.LTFMGMT.geometry
  const comment = window.LTFMGMT.comment
  const isHoldingComment = comment.type === 'holding'
  const commentMap = window.LTFMGMT.commentMap
  const capabilities = window.LTFMGMT.capabilities
  const selectedArray = isHoldingComment ? holdingCommentBoundaries : llfaBoundaries

  // Description
  const commentName = document.getElementById('comment-description')
  commentName.value = comment.description
  // Generate boundary options
  const commentBoundarySelect = document.getElementById('comment-boundary')

  for (let i = 0; i < selectedArray.length; i++) {
    const option = document.createElement('option')
    option.value = selectedArray[i].toLowerCase().replace(/\s+/g, '')
    option.text = selectedArray[i]
    if (selectedArray[i] === comment.boundary) {
      option.selected = true
    }
    commentBoundarySelect.add(option)
  }

  // Add comment features to the form
  const container = document.getElementById('comment-container')

  geometry.features.forEach(function (feature, index) {
    console.log(feature)
    console.log(geometry)
    const listEl = document.createElement('li')
    listEl.className = 'feature'
    listEl.style.textAlign = 'start'
    const geo = Object.assign({}, geometry, {
      features: geometry.features.filter(function (f) {
        return f === feature
      })
    })

    // Map div
    const mapDiv = document.createElement('div')
    mapDiv.className = 'comment-map'
    mapDiv.id = `map_${index}`
    listEl.appendChild(mapDiv)

    // Flood risk div
    const floodRiskDiv = document.createElement('div')
    floodRiskDiv.className = 'govuk-form-group'
    const floodRiskLabel = createLabel('Select the flood risk you want to update for points inside this area', `comment-type_${index}`)
    floodRiskDiv.appendChild(floodRiskLabel)

    const SWRadio = createRadio(`floodRiskType_${index}`, 'Surface water', 'Surface water', `override-div_${index}`, true)
    const RTSRadio = createRadio(`floodRiskType_${index}`, 'Rivers and the sea', 'Rivers and the sea', `override-div_${index}`)
    floodRiskDiv.appendChild(SWRadio)
    floodRiskDiv.appendChild(RTSRadio)
    listEl.appendChild(floodRiskDiv)

    // Override risk div
    if (isHoldingComment) {
      const overrideDiv = document.createElement('div')
      overrideDiv.className = 'govuk-form-group'
      overrideDiv.id = `override-div_${index}`
      const riskOverrideValue = feature.properties.riskOverride

      const overrideLabel = createLabel('Do you want to override the flood risk rating?', `override_${index}`)
      const noOverrideRadio = createOverrideRadio(`override_${index}`, riskOverrideValue, 'No, do not override', 'Do not override', true, `overrideValues_${index}`)
      const overrideRadio = createOverrideRadio(`override_${index}`, riskOverrideValue, 'Yes, override surface water', 'Override', true, `overrideValues_${index}`)

      const nestedList = document.createElement('div')
      nestedList.className = 'nested-list'
      nestedList.id = `overrideValues_${index}`

      const highRadio = createOverrideRadio(`overrideValue_${index}`, riskOverrideValue, 'High', 'High')
      const mediumRadio = createOverrideRadio(`overrideValue_${index}`, riskOverrideValue, 'Medium', 'Medium')
      const lowRadio = createOverrideRadio(`overrideValue_${index}`, riskOverrideValue, 'Low', 'Low')
      const veryLowRadio = createOverrideRadio(`overrideValue_${index}`, riskOverrideValue, 'Very low', 'Very low')

      nestedList.appendChild(highRadio)
      nestedList.appendChild(mediumRadio)
      nestedList.appendChild(lowRadio)
      nestedList.appendChild(veryLowRadio)

      if (riskOverrideValue !== 'Do not override') {
        nestedList.style.display = 'block'
      }
      overrideDiv.appendChild(overrideLabel)
      overrideDiv.appendChild(noOverrideRadio)
      overrideDiv.appendChild(overrideRadio)
      overrideDiv.appendChild(nestedList)
      listEl.appendChild(overrideDiv)
    }

    // Info div
    const infoDiv = document.createElement('div')
    const infoExample = createHint('For example: "The rivers and sea flood risk for this area has changed. For more information, email <a href=mailto: enquiries@environment-agency.gov.uk>enquiries@environment-agency.gov.uk</a>.')
    const infoLabel = createLabel('Enter the holding comment text', `info-text_${index}`)
    const guidanceLink = '/comment-guidance'
    const hintInfo = createHint(`The info text will display to public users in this area. Read the <a href=${guidanceLink} target='_blank'>comment guidance</a> before writing or pasting anything. You cannot use more than 150 characters.`)
    const textarea = createTextarea(`info-text_${index}`, feature.properties.info, 5, 150, `hint-info_${index}`)

    infoDiv.appendChild(infoLabel)
    infoDiv.appendChild(infoExample)
    infoDiv.appendChild(hintInfo)
    infoDiv.appendChild(textarea)
    listEl.append(infoDiv)

    // Dates display in format same as your system's default - not sure how to override it and if we actually want to do that.
    // Start date div
    const startDateDiv = createFormGroupWithDate(feature.properties.start, 'Enter the start date', 'Select the date the holding comment is valid from.<br>Your holding comment will not go live automatically - it’ll be uploaded after it’s approved. For internal use only - the date will not be displayed to public users.', 'start-date')
    listEl.appendChild(startDateDiv)
    // End date div
    const endDateDiv = createFormGroupWithDate(feature.properties.end, 'Enter the end date', 'Select the date the holding comment is valid to.<br>You must remove your holding comment on the end date - it will not be removed automatically. For internal use only - the date will not be displayed to public users.', 'end-date')
    endDateDiv.className = 'end-date-div'
    listEl.appendChild(endDateDiv)
    // Append the list element to the container
    container.appendChild(listEl)
    // Generate maps.
    commentMap(geo, 'map_' + index, capabilities)
  })

  if (geometry.features.length > 1) {
    commentMap(geometry, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
  }
}

function createLabel (string, labeledElement) {
  const label = document.createElement('label')
  label.classList.add('govuk-label', 'govuk-label--s')
  label.setAttribute('for', labeledElement)
  label.textContent = string
  return label
}

function createHint (text) {
  const hint = document.createElement('div')
  hint.className = 'govuk-hint'
  hint.innerHTML = text
  return hint
}

function createFormGroupWithDate (date, labelText, hintText, inputId) {
  const dateDiv = document.createElement('div')
  dateDiv.classList.add('govuk-form-group')

  const label = createLabel(labelText)
  const hint = createHint(hintText)

  const input = document.createElement('input')
  input.classList.add('govuk-input', 'govuk-input--width-20', 'date-div')
  input.setAttribute('id', inputId)
  input.setAttribute('type', 'date')
  input.value = date

  dateDiv.appendChild(label)
  dateDiv.appendChild(hint)
  dateDiv.appendChild(input)

  return dateDiv
}
createCommentSchema()
