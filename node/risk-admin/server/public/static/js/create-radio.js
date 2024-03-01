export function createRadio (name, labelText, value, overrideId, checked = false) {
  const radio = document.createElement('input')
  const transformedValue = value.toLowerCase().replace(/\s+/g, '-')
  radio.setAttribute('type', 'radio')
  radio.setAttribute('id', transformedValue)
  radio.setAttribute('name', name)
  radio.setAttribute('value', value)
  radio.checked = checked

  radio.addEventListener('change', function () {
    handleFloodRiskTypeChange(this, overrideId)
  })

  const label = document.createElement('label')
  label.setAttribute('for', transformedValue)
  label.textContent = labelText

  const lineBreak = document.createElement('br')
  const radioDiv = document.createElement('div')
  radioDiv.appendChild(radio)
  radioDiv.appendChild(label)
  radioDiv.appendChild(lineBreak)
  return radioDiv
}

function handleFloodRiskTypeChange (radio, overrideId) {
  const overrideDiv = document.getElementById(overrideId)

  if (radio.value === 'Surface water') {
    overrideDiv.style.display = 'block'
  } else {
    overrideDiv.style.display = 'none'
    const overrideValues = overrideDiv.querySelectorAll('[name^="override"]')
    overrideValues.forEach(function (value) {
      value.checked = false
    })
  }
}
