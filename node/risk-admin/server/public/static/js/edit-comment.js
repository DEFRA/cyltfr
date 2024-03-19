const commentMap = window.LTFMGMT.commentMap
const geometry = window.LTFMGMT.geometry
const capabilities = window.LTFMGMT.capabilities
const selectedRadio = window.LTFMGMT.selectedRadio
const type = window.LTFMGMT.type
const textareas = document.querySelectorAll('textarea')
const remainingCharsTexts = document.querySelectorAll('.remaining-chars-text')
const maxLengths = Array.from(textareas).map(textarea => parseInt(textarea.getAttribute('maxLength')))
const editForm = document.getElementById('comment-form-edit')

document.addEventListener('DOMContentLoaded', () => {
  geometry.features.forEach(function (feature, index) {
    const overrideOrNoOverrideRadio = document.getElementById(`features_${index}_properties_riskOverride`)
    const riskOptionRadios = document.getElementById(`risk-options_${index}`)
    const overrideRadio = document.getElementById(`map_${index}-override`)
    const riskRadios = document.getElementsByClassName(`risk-option_${index}`)
    const riskReportRadios = document.getElementsByClassName(`risk-report_${index}`)
    const geo = Object.assign({}, geometry, {
      features: geometry.features.filter(function (f) {
        return f === feature
      })
    })

    if (type === 'holding') {
      if (overrideRadio.checked) {
        riskOptionRadios.style.display = 'block'
      }

      overrideOrNoOverrideRadio.addEventListener('change', function () {
        if (overrideRadio.checked) {
          riskOptionRadios.style.display = 'block'
        } else {
          riskOptionRadios.style.display = 'none'
        }
      })

      for(let i = 0; i < riskRadios.length; i++) {
        if (riskRadios[i].value === selectedRadio[index]) {
          riskOptionRadios.style.display = 'block'
          overrideRadio.checked = true
          riskRadios[i].checked = true
        } 
      }
    } else {
      for(let i = 0; i < riskReportRadios.length; i++) {
        if (riskReportRadios[i].value === selectedRadio[index]) {
          riskReportRadios[i].checked = true
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
