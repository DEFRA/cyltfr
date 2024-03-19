
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
  }).then(function (response) {
    spinner.style.display = 'none'

    if (!response.ok) {
      throw new Error(response.statusText)
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
      const geo = {
        ...jsonFileData,
        features: jsonFileData.features.filter(f => f === feature)
      }
      startDateField[index].value = `${jsonFileData.features[index].properties.start}`
      endDateField[index].value = `${jsonFileData.features[index].properties.end}`
      if (isHoldingComment) {
        featureTextAreas[index].value = `${jsonFileData.features[index].properties.info}`
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

    function updateRemainingChars(textarea, remainingCharsText) {
      const maxLength = parseInt(textarea.getAttribute('maxLength'))
      remainingCharsText.innerHTML = maxLength - textarea.value.length
    }
    
    return jsonFileData
  }).then(function (jsonFileData) {
    // Construct the form data checking for any changes made by user in fields ready for payload
    const commentForm = document.getElementById('comment-form')

    function handleFormSubmit(event) {
      event.preventDefault()
      const formData = new FormData(event.target)

      const boundaryValue = formData.get('boundary')
      jsonFileData.boundary = boundaryValue

      jsonFileData.features.forEach(function (_feature, index) {
        const riskOverrideValue = formData.get(`features_${index}_properties_riskOverride`)
        const riskReportType = formData.get(`features_${index}_properties_report_type`)

        jsonFileData.features[index].properties.riskReportType = riskReportType
        jsonFileData.features[index].properties.riskOverride = riskOverrideValue

        if (jsonFileData.name !== formData.get(`name`)) {
          jsonFileData.name = formData.get(`name`)
        }
        if (jsonFileData.features[index].properties.start !== formData.get(`features_${index}_properties_start`)) {
          jsonFileData.features[index].properties.start = formData.get(`features_${index}_properties_start`)
        }
        if (jsonFileData.features[index].properties.end !== formData.get(`features_${index}_properties_end`)) {
          jsonFileData.features[index].properties.end = formData.get(`features_${index}_properties_end`)
        }
        if (jsonFileData.features[index].properties.info !== formData.get(`features_${index}_properties_info`)) {
          jsonFileData.features[index].properties.info = formData.get(`features_${index}_properties_info`)
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
    window.alert('Invalid shapefile')
  })
})
