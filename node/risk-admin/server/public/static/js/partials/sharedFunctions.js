const sharedFunctions = {
  addCharacterCounts: () => {
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
  },

  setInitialValues: (index, isHoldingComment, selectedRadio = [], riskType = [], textCommentRadio = []) => {
    const overrideRadio = document.getElementById(`map_${index}-override`)
    const noOverrideRadio = document.getElementById(`map_${index}-no-override`)
    const riskOptionRadios = document.getElementById(`risk-options_${index}`)
    const riskTypeRadios = document.getElementById(`features_${index}_properties_risk_type`)
    const rsRadio = document.getElementById(`rs_${index}`)
    const overrideRadioSection = document.getElementById(`risk-override-radios_${index}`)
    const addCommentRadios = document.getElementById(`features_${index}_properties_add_comment`)
    const noHoldingCommentTextRadio = document.getElementById(`text_no_${index}`)
    const riskTypes = document.getElementsByClassName(`risk-type-${index}`)
    const textCommentRadios = document.getElementsByClassName(`textComment_radio_${index}`)

    const checkRiskOptions = () => {
      const riskRadios = document.getElementsByClassName(`risk-option_${index}`)
      for (const radio of riskRadios) {
        if (radio.value === selectedRadio[index]) {
          riskOptionRadios.style.display = 'block'
          overrideRadio.checked = true
          radio.checked = true
        }
      }
    }

    const textArea = document.getElementById(`text_area_${index}`)

    if (isHoldingComment) {
      checkRiskOptions()

      for (const typeRadio of riskTypes) {
        typeRadio.checked = (typeRadio.value === riskType[index])
      }

      for (const commentRadio of textCommentRadios) {
        if (commentRadio.value === textCommentRadio[index]) {
          commentRadio.checked = true
        }
        if (textCommentRadio[index] === 'No') {
          textArea.style.display = 'none'
        }
      }

      overrideRadioSection.style.display = rsRadio.checked ? 'none' : 'block'

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
        overrideRadioSection.style.display = rsRadio.checked ? 'none' : 'block'
      })
      addCommentRadios.addEventListener('change', function () {
        textArea.style.display = noHoldingCommentTextRadio.checked ? 'none' : 'block'
      })
    } else {
      const riskReportRadios = document.getElementsByClassName(`risk-report_${index}`)
      for (const radio of riskReportRadios) {
        radio.checked = (radio.value === selectedRadio[index])
      }
    }
  }

}
window.LTFMGMT.sharedFunctions = sharedFunctions
