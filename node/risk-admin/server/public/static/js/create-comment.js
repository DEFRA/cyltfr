class CreateCommentPage {
  constructor (window) {
    this.window = window
    this.document = window.document
    this.FormData = window.FormData
    this.fetch = window.fetch
    this.commentMap = window.LTFMGMT.commentMap
    this.capabilities = window.LTFMGMT.capabilities
    this.type = window.LTFMGMT.type
    this.isHoldingComment = this.type === 'holding'
    this.document.getElementById('geometry').addEventListener('change', this.fileChange)
  }

  showErrorMessage (message) {
    const messageBox = this.document.getElementById('error-message')
    const messageText = this.document.getElementById('error-message-text')

    messageText.textContent = message
    messageBox.style.display = 'block'
    this.document.getElementById('spinner').style.display = 'none'
    this.document.getElementById('geometry').style.display = 'block'
  }

  addFeatureHtml = function (feature, index, features) {
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
      ...this.jsonFileData,
      features: features.filter(f => f === feature)
    }
    this.startDateField[index].value = `${feature.properties.start}`
    this.endDateField[index].value = `${feature.properties.end}`

    if (this.createCommentPage.isHoldingComment) {
      this.featureTextAreas[index].value = `${feature.properties.info}`
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
    this.createCommentPage.commentMap(geo, 'map_' + index, this.createCommentPage.capabilities)
  }

  fileChange = async (event) => {
  // Read file and add to form data fields
    if (!event.target.files?.length) {
      return
    }

    const formData = new FormData()

    formData.append('geometry', event.target.files[0])

    event.target.style.display = 'none'
    document.getElementById('spinner').style.display = 'inline'

    let jsonFileData
    try {
    // Process data using the shp2json router
      jsonFileData = await this.getJsonFileData(formData)
    } catch (error) {
      this.showErrorMessage('Invalid shapefile: ' + error.message)
      return
    }

    // Add feature sections for each feature
    const featureForm = document.getElementById('features')

    jsonFileData.features.forEach((_feature, index) => {
      featureForm.insertAdjacentHTML('beforeend', window.LTFMGMT.addFeatureHtml(index, this.type))
    })

    document.querySelectorAll('.comment-map').forEach((div, index) => {
      div.id = 'map_' + index
    })
    document.getElementById('data_name').setAttribute('value', `${jsonFileData.name}`)
    document.getElementById('file').remove()
    document.getElementById('comment-form').style.display = 'block'

    const contextData = {
      jsonFileData,
      featureTextAreas: document.querySelectorAll('.govuk-textarea'),
      startDateField: document.querySelectorAll('.start-date'),
      endDateField: document.querySelectorAll('.end-date'),
      createCommentPage: this
    }

    jsonFileData.features.forEach(this.addFeatureHtml, contextData)

    if (jsonFileData.features.length > 1) {
      this.commentMap(jsonFileData, 'map', this.capabilities, 'The map below shows all geometries contained within the shapefile')
    }

    // Add char count for the text areas
    this.addCharacterCounts()

    document.getElementById('comment-form').addEventListener('submit', async (event) => {
      try {
        this.handleFormSubmit(event, jsonFileData)

        const response = await fetch('/comment/create/' + this.type, {
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
        this.showErrorMessage('Save failed')
      }
    })
  }

  handleFormSubmit = (event, jsonFileData) => {
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

      if (this.isHoldingComment) {
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

  getJsonFileData = async (formData) => {
    const response = await fetch('/shp2json/' + this.type, {
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

  addCharacterCounts () {
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
  }
}

window.LTFMGMT.createCommentPage = new CreateCommentPage(window)
