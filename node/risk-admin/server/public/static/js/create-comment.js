function setUpCreateComment (window) {
  const FormData = window.FormData
  const fetch = window.fetch
  const commentMap = window.LTFMGMT.commentMap
  const capabilities = window.LTFMGMT.capabilities
  const document = window.document

  const spinner = document.getElementById('spinner')
  const fileInput = document.getElementById('geometry')

  const type = window.LTFMGMT.type
  const isHoldingComment = type === 'holding'

  const showErrorMessage = function (message) {
    const messageBox = document.getElementById('error-message')
    const messageText = document.getElementById('error-message-text')

    messageText.textContent = message
    messageBox.style.display = 'block'
    spinner.style.display = 'none'
    fileInput.style.display = 'block'
  }

  fileInput.addEventListener('change', async (_event) => {
  // Read file and add to form data fields
    if (!fileInput.files?.length) {
      return
    }

    const formData = new FormData()

    formData.append('geometry', fileInput.files[0])

    fileInput.style.display = 'none'
    spinner.style.display = 'inline'

    let jsonFileData
    try {
    // Process data using the shp2json router
      jsonFileData = await getJsonFileData(formData)
    } catch (error) {
      showErrorMessage('Invalid shapefile: ' + error.message)
      return
    }

    // Add feature sections for each feature
    const featureForm = document.getElementById('features')

    jsonFileData.features.forEach(function (_feature, index) {
      featureForm.insertAdjacentHTML('beforeend', window.LTFMGMT.addFeature(index, type))
    })

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

    const commentForm = document.getElementById('comment-form')

    commentForm.addEventListener('submit', async (event) => {
      try {
        handleFormSubmit(event, jsonFileData)

        const response = await fetch('/comment/create/' + type, {
          method: 'post',
          body: JSON.stringify(jsonFileData),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          window.location.href = '/'
        } else {
          throw new Error(response.statusText)
        }
      } catch (error) {
        console.error(error)
        showErrorMessage('Save failed')
      }
    })
  })

  function handleFormSubmit (event, jsonFileData) {
    event.preventDefault()
    const eventFormData = new FormData(event.target)

    const boundaryValue = eventFormData.get('boundary')
    jsonFileData.boundary = boundaryValue
    if (jsonFileData.name !== eventFormData.get('name')) {
      jsonFileData.name = eventFormData.get('name')
    }

    jsonFileData.features.forEach(function (feature, index) {
      const riskTypeValue = eventFormData.get(`sw_or_rs_${index}`)
      const riskOverrideValue = eventFormData.get(`override_${index}-risk`)
      const riskReportType = eventFormData.get(`features_${index}_properties_report_type`)
      const addCommentRadio = eventFormData.get(`add_holding_comment_${index}`)

      if (feature.properties.end !== eventFormData.get(`features_${index}_properties_end`)) {
        feature.properties.end = eventFormData.get(`features_${index}_properties_end`)
      }
      if (feature.properties.start !== eventFormData.get(`features_${index}_properties_start`)) {
        feature.properties.start = eventFormData.get(`features_${index}_properties_start`)
      }

      if (isHoldingComment) {
        feature.properties.riskType = riskTypeValue
        if (feature.properties.info !== eventFormData.get(`features_${index}_properties_info`)) {
          feature.properties.info = eventFormData.get(`features_${index}_properties_info`)
        }
        if (riskTypeValue === 'Surface water') {
          feature.properties.riskOverride = riskOverrideValue
        }
        if (addCommentRadio === 'No') {
          feature.properties.commentText = 'No'
          feature.properties.info = ''
        } else {
          feature.properties.commentText = 'Yes'
        }
      } else {
        feature.properties.info = riskReportType
      }
    })
  }

  async function getJsonFileData (formData) {
    const response = await fetch('/shp2json/' + type, {
      method: 'post',
      body: formData
    })
    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.message)
    }
    const jsonFileData = await response.json()
    return jsonFileData
  }
}

setUpCreateComment(window)
