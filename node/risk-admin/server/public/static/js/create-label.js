export function createLabel (string, labeledElement) {
  const label = document.createElement('label')
  label.classList.add('govuk-label', 'govuk-label--s')
  label.setAttribute('for', labeledElement)
  label.textContent = string
  return label
}
