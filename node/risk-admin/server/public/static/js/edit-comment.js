const commentMap = window.LTFMGMT.commentMap
const geometry = window.LTFMGMT.geometry
const capabilities = window.LTFMGMT.capabilities
const selectedRadio = window.LTFMGMT.selectedRadio
const riskType = window.LTFMGMT.riskType
const type = window.LTFMGMT.type
const textareas = document.querySelectorAll('textarea')
const remainingCharsTexts = document.querySelectorAll('.remaining-chars-text')
const maxLengths = Array.from(textareas).map(textarea => parseInt(textarea.getAttribute('maxLength')))
const editForm = document.getElementById('comment-form-edit')

document.addEventListener('DOMContentLoaded', () => {
  geometry.features.forEach(function (feature, index) {
    const noOverrideRadio = document.getElementById(`map_${index}-no-override`)
    const riskOptionRadios = document.getElementById(`risk-options_${index}`)
    const overrideRadio = document.getElementById(`map_${index}-override`)
    const riskRadios = document.getElementsByClassName(`risk-option_${index}`)
    const riskReportRadios = document.getElementsByClassName(`risk-report_${index}`)
    const riskTypes = document.getElementsByClassName(`risk-type-${index}`)
    const riskTypeRadios = document.getElementById(`features_${index}_properties_risk_type`)
    const rsRadio = document.getElementById(`rs_${index}`)
    const overrideRadioSection = document.getElementById(`risk-override-radios_${index}`)

    const geo = Object.assign({}, geometry, {
      features: geometry.features.filter(function (f) {
        return f === feature
      })
    })

    if (type === 'holding') {
      for(let radio of riskRadios) {
        if (radio.value === selectedRadio[index]) {
          riskOptionRadios.style.display = 'block'
          overrideRadio.checked = true
          radio.checked = true
        }
      }

      for(let typeRadio of riskTypes) {
        if (typeRadio.value === riskType[index]) {
          typeRadio.checked = true
        }
      }

      if (rsRadio.checked) {
        overrideRadioSection.style.display = 'none'
      } else {
        overrideRadioSection.style.display = 'block'
      }

      if (overrideRadio.checked) {
        riskOptionRadios.style.display = 'block'
      }

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
    } else {
      for(let radio of riskReportRadios) {
        if (radio.value === selectedRadio[index]) {
          radio.checked = true
        } 
      } 
    }
    commentMap(geo, 'map_' + index, capabilities)
  })
})

document.addEventListener('DOMContentLoaded', () => {
  textareas.forEach((textarea, index) => {
    updateRemainingChars(textarea, remainingCharsTexts[index])
    textarea.addEventListener('input', () => {
      updateRemainingChars(textarea, remainingCharsTexts[index])
    })
  })
})

function updateRemainingChars(textarea, remainingCharsText) {
  const maxLength = parseInt(textarea.getAttribute('maxLength'))
  remainingCharsText.innerHTML = maxLength - textarea.value.length
}

commentMap(geometry, 'map', capabilities, 'The map below shows all geometries contained within the shapefile')
