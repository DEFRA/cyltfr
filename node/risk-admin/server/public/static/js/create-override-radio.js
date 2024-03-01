export function createOverrideRadio (name, riskOverrideValue = '', labelText, value, hasNested = false, nestedId = '') {
  const radio = document.createElement('input')
  const transformedValue = value.toLowerCase().replace(/\s+/g, '-')
  radio.setAttribute('type', 'radio')
  radio.setAttribute('id', transformedValue)
  radio.setAttribute('name', name)
  radio.setAttribute('value', value)

  if (value === riskOverrideValue) {
    radio.checked = true
  }
  if (hasNested) {
    radio.addEventListener('change', function () {
      handleOverrideRadioChange(this, nestedId)
    })
  }
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

function handleOverrideRadioChange (radio, nestedId) {
  const nestedList = document.getElementById(nestedId)

  if (radio.value === 'Override') {
    nestedList.style.display = 'block'
  } else {
    nestedList.style.display = 'none'
    const overrideValues = nestedList.querySelectorAll('[name^="overrideValue"]')
    overrideValues.forEach(function (value) {
      value.checked = false
    })
  }
}
