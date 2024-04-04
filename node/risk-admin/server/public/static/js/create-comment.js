const FormData = window.FormData
const fetch = window.fetch
const commentMap = window.LTFMGMT.commentMap
const capabilities = window.LTFMGMT.capabilities

const spinner = document.getElementById('spinner')
const fileInput = document.getElementById('geometry')

const type = window.LTFMGMT.type
const isHoldingComment = type === 'holding'

fileInput.addEventListener('change', function (e) {
  // Read file and add to form data fields
  const formData = new FormData()

  if (!fileInput.files || !fileInput.files.length) {
    return
  }

  formData.append('geometry', fileInput.files[0])

  fileInput.style.display = 'none'
  spinner.style.display = 'inline'

  // Process data using the shp2json router
  fetch('/shp2json/' + type, {
    method: 'post',
    body: formData
  }).then(async function (response) {
    spinner.style.display = 'none'

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message)
    }

    return response
  }).then(function (response) {
    // Convert response to Json
    return response.json()
  }).then(function (jsonFileData) {
    // Add feature sections for each feature
    const featureForm = document.getElementById('features')

    jsonFileData.features.forEach(function (_feature, index) {
      featureForm.insertAdjacentHTML('beforeend', addFeature(index, type))
    })

    return jsonFileData
  }).then(function (jsonFileData) {
    // Add ID values and import maps and form field values based on provided file data
    const featureMapDivs = document.querySelectorAll('.comment-map')
    const featureTextAreas = document.querySelectorAll('.govuk-textarea')
    const startDateField = document.querySelectorAll('.start-date')
    const endDateField = document.querySelectorAll('.end-date')
    const dataName = document.getElementById('data_name')
    document.getElementById('file').remove()
    document.getElementById('comment-form').style.display = 'block'

    dataName.setAttribute('value', `${jsonFileData.name}`)

    featureMapDivs.forEach(function (div, index) {
      div.id = 'map_' + index
    })

    jsonFileData.features.forEach(function (feature, index) {
      const riskOptionRadios = document.getElementById(`risk-options_${index}`)
      const overrideRadio = document.getElementById(`map_${index}-override`)
      const noOverrideRadio = document.getElementById(`map_${index}-no-override`)
      const riskTypeRadios = document.getElementById(`features_${index}_properties_risk_type`)
      const rsRadio = document.getElementById(`rs_${index}`)
      const overrideRadioSection = document.getElementById(`risk-override-radios_${index}`)
      const addCommentRadios = document.getElementById(`features_${index}_properties_add_comment`)
      const noHoldingCommentTextRadio = document.getElementById(`text_no_${index}`)
      const textArea = document.getElementById(`text_area_${index}`)
      const geo = {
        ...jsonFileData,
        features: jsonFileData.features.filter(f => f === feature)
      }
      startDateField[index].value = `${jsonFileData.features[index].properties.start}`
      endDateField[index].value = `${jsonFileData.features[index].properties.end}`

      if (isHoldingComment) {
        featureTextAreas[index].value = `${jsonFileData.features[index].properties.info}`
        overrideRadio.addEventListener('click', function () {
          noOverrideRadio.checked = false
          riskOptionRadios.style.display = 'block'
        })
        noOverrideRadio.addEventListener('click', function () {
          overrideRadio.checked = false
          riskOptionRadios.style.display = 'none'
        })
        riskTypeRadios.addEventListener('change', function () {
          if (rsRadio.checked) {
            overrideRadioSection.style.display = 'none'
          } else {
            overrideRadioSection.style.display = 'block'
          }
        })
        addCommentRadios.addEventListener('change', function () {
          if (noHoldingCommentTextRadio.checked) {
            textArea.style.display = 'none'
          } else {
            textArea.style.display = 'block'
          }
        })
      }
      commentMap(geo, 'map_' + index, capabilities)
    })

    if (jsonFileData.features.length > 1) {
      commentMap(jsonFileData, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
    }

    // Add char count for the text areas
    const textareas = document.querySelectorAll('textarea')
    const remainingCharsTexts = document.querySelectorAll('.remaining-chars-text')

    textareas.forEach((textarea, index) => {
      updateRemainingChars(textarea, remainingCharsTexts[index])
      textarea.addEventListener('input', () => {
        updateRemainingChars(textarea, remainingCharsTexts[index])
      })
    })

    function updateRemainingChars (textarea, remainingCharsText) {
      const maxLength = parseInt(textarea.getAttribute('maxLength'))
      remainingCharsText.innerHTML = maxLength - textarea.value.length
    }

    return jsonFileData
  }).then(function (jsonFileData) {
    // Construct the form data checking for any changes made by user in fields ready for payload
    const commentForm = document.getElementById('comment-form')

    function handleFormSubmit (event) {
      event.preventDefault()
      const eventFormData = new FormData(event.target)

      const boundaryValue = eventFormData.get('boundary')
      jsonFileData.boundary = boundaryValue

      jsonFileData.features.forEach(function (_feature, index) {
        const riskTypeValue = eventFormData.get(`sw_or_rs_${index}`)
        const riskOverrideValue = eventFormData.get(`override_${index}-risk`)
        const riskReportType = eventFormData.get(`features_${index}_properties_report_type`)
        const addCommentRadio = eventFormData.get(`add_holding_comment_${index}`)

        if (jsonFileData.name !== eventFormData.get('name')) {
          jsonFileData.name = eventFormData.get('name')
        }
        if (jsonFileData.features[index].properties.end !== eventFormData.get(`features_${index}_properties_end`)) {
          jsonFileData.features[index].properties.end = eventFormData.get(`features_${index}_properties_end`)
        }
        if (jsonFileData.features[index].properties.start !== eventFormData.get(`features_${index}_properties_start`)) {
          jsonFileData.features[index].properties.start = eventFormData.get(`features_${index}_properties_start`)
        }

        if (isHoldingComment) {
          jsonFileData.features[index].properties.riskType = riskTypeValue
          if (jsonFileData.features[index].properties.info !== eventFormData.get(`features_${index}_properties_info`)) {
            jsonFileData.features[index].properties.info = eventFormData.get(`features_${index}_properties_info`)
          }
          if (riskTypeValue === 'Surface water') {
            jsonFileData.features[index].properties.riskOverride = riskOverrideValue
          }
          if (addCommentRadio === 'No') {
            jsonFileData.features[index].properties.commentText = 'No'
            jsonFileData.features[index].properties.info = ''
          } else {
            jsonFileData.features[index].properties.commentText = 'Yes'
          }
        } else {
          jsonFileData.features[index].properties.info = riskReportType
        }
      })
    }

    commentForm.addEventListener('submit', function (event) {
      handleFormSubmit(event)

      fetch('/comment/create/' + type, {
        method: 'post',
        body: JSON.stringify(jsonFileData),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        if (response.ok) {
          window.location.href = '/'
        } else {
          throw new Error(response.statusText)
        }
      }).catch(function (err) {
        console.error(err)
        window.alert('Save failed')
      })
    })
  }).catch(function (err) {
    console.error(err)
    window.alert('Invalid shapefile: ' + err.message)
  })
})
