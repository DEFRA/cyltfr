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
    const riskRadios = document.getElementsByClassName(`risk-option_${index}`)
    const riskReportRadios = document.getElementsByClassName(`risk-report_${index}`)
    const riskTypes = document.getElementsByClassName(`risk-type-${index}`)
    const textCommentRadios = document.getElementsByClassName(`textComment_radio_${index}`)

    const textArea = document.getElementById(`text_area_${index}`)

    if (isHoldingComment) {
      for (const radio of riskRadios) {
        if (radio.value === selectedRadio[index]) {
          riskOptionRadios.style.display = 'block'
          overrideRadio.checked = true
          radio.checked = true
        }
      }

      for (const typeRadio of riskTypes) {
        if (typeRadio.value === riskType[index]) {
          typeRadio.checked = true
        }
      }

      for (const commentRadio of textCommentRadios) {
        if (commentRadio.value === textCommentRadio[index]) {
          commentRadio.checked = true
        }
        if (textCommentRadio[index] === 'No') {
          textArea.style.display = 'none'
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
      addCommentRadios.addEventListener('change', function () {
        if (noHoldingCommentTextRadio.checked) {
          textArea.style.display = 'none'
        } else {
          textArea.style.display = 'block'
        }
      })
    } else {
      for (const radio of riskReportRadios) {
        if (radio.value === selectedRadio[index]) {
          radio.checked = true
        }
      }
    }
  }

}
window.LTFMGMT.sharedFunctions = sharedFunctions
