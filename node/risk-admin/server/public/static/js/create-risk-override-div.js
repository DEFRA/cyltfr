import { createLabel } from './create-label.js'
import { createOverrideRadio } from './create-override-radio.js'

export function createRiskOverrideDiv (index, riskOverrideValue) {
  const overrideDiv = document.createElement('div')
  overrideDiv.className = 'govuk-form-group'
  overrideDiv.id = `override-div_${index}`

  const overrideLabel = createLabel('Do you want to override the flood risk rating?', `override_${index}`)
  const noOverrideRadio = createOverrideRadio(`override_${index}`, 'No, do not override', 'Do not override', riskOverrideValue, true, `overrideValues_${index}`)
  const overrideRadio = createOverrideRadio(`override_${index}`, 'Yes, override surface water', 'Override', riskOverrideValue, true, `overrideValues_${index}`)

  const nestedList = document.createElement('div')
  nestedList.className = 'nested-list'
  nestedList.id = `overrideValues_${index}`

  const highRadio = createOverrideRadio(`overrideValue_${index}`, 'High', 'High', riskOverrideValue)
  const mediumRadio = createOverrideRadio(`overrideValue_${index}`, 'Medium', 'Medium', riskOverrideValue)
  const lowRadio = createOverrideRadio(`overrideValue_${index}`, 'Low', 'Low', riskOverrideValue)
  const veryLowRadio = createOverrideRadio(`overrideValue_${index}`, 'Very low', 'Very low', riskOverrideValue)

  nestedList.appendChild(highRadio)
  nestedList.appendChild(mediumRadio)
  nestedList.appendChild(lowRadio)
  nestedList.appendChild(veryLowRadio)

  if (riskOverrideValue !== 'Do not override') {
    nestedList.style.display = 'block'
  }
  overrideDiv.appendChild(overrideLabel)
  overrideDiv.appendChild(noOverrideRadio)
  overrideDiv.appendChild(overrideRadio)
  overrideDiv.appendChild(nestedList)
  return overrideDiv
}
