import { holdingCommentBoundaries, llfaBoundaries } from './boundaries.js'

import { createLabel } from './create-label.js'
import { createRadio } from './create-radio.js'
import { createRiskOverrideDiv } from './create-risk-override-div.js'
import { createTextarea } from './create-text-area.js'

const govukFormClass = 'govuk-form-group'
// The form's inputs are not required, but they should be if visible on the page (the elements when hidden shouldn't be required)
const createCommentSchema = () => {
  const geometry = window.LTFMGMT.geometry
  const comment = window.LTFMGMT.comment
  const isHoldingComment = comment.type === 'holding'
  const commentMap = window.LTFMGMT.commentMap
  const capabilities = window.LTFMGMT.capabilities
  const boundaries = isHoldingComment ? holdingCommentBoundaries : llfaBoundaries

  // Description
  const commentName = document.getElementById('comment-description')
  commentName.value = comment.description
  // Generate boundary options
  const commentBoundarySelect = document.getElementById('comment-boundary')

  for (const boundary of boundaries) {
    const option = document.createElement('option')
    option.value = boundary.toLowerCase().replace(/\s+/g, '')
    option.text = boundary
    if (boundary === comment.boundary) {
      option.selected = true
    }
    commentBoundarySelect.add(option)
  }

  // Add comment features to the form
  const container = document.getElementById('comment-container')

  geometry.features.forEach(function (feature, index) {
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
    floodRiskDiv.className = govukFormClass
    const floodRiskLabel = createLabel('Select the flood risk you want to update for points inside this area', `comment-type_${index}`)
    floodRiskDiv.appendChild(floodRiskLabel)

    const SWRadio = createRadio(`floodRiskType_${index}`, 'Surface water', 'Surface water', `override-div_${index}`, true)
    const RTSRadio = createRadio(`floodRiskType_${index}`, 'Rivers and the sea', 'Rivers and the sea', `override-div_${index}`)
    floodRiskDiv.appendChild(SWRadio)
    floodRiskDiv.appendChild(RTSRadio)
    listEl.appendChild(floodRiskDiv)

    // Override risk div
    if (isHoldingComment) {
      const riskOverrideValue = feature.properties.riskOverride
      listEl.appendChild(createRiskOverrideDiv(index, riskOverrideValue))
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

function createHint (text) {
  const hint = document.createElement('div')
  hint.className = 'govuk-hint'
  hint.innerHTML = text
  return hint
}

function createFormGroupWithDate (date, labelText, hintText, inputId) {
  const dateDiv = document.createElement('div')
  dateDiv.classList.add(govukFormClass)

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
