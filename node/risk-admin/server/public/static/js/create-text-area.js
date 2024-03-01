export function createTextarea (id, text, rows, maxLength, hintId) {
  const textarea = document.createElement('textarea')
  const textareaHint = document.createElement('div')
  const textareaDiv = document.createElement('div')

  textareaHint.id = hintId
  textareaHint.className = 'govuk-hint'
  textareaHint.textContent = 'You have ' + (maxLength - text?.length) + ' characters remaining.'
  textarea.classList.add('govuk-textarea')
  textarea.setAttribute('id', id)
  textarea.setAttribute('rows', rows)
  textarea.setAttribute('maxlength', maxLength)
  textarea.addEventListener('input', function () {
    updateCharCount(this, hintId)
  })
  textarea.value = text

  textareaDiv.appendChild(textarea)
  textareaDiv.appendChild(textareaHint)
  return textareaDiv
}

function updateCharCount (textArea, hintId) {
  const charCount = document.getElementById(hintId)
  const remainingChars = textArea.maxLength - textArea.value.length

  charCount.textContent = 'You have ' + remainingChars + ' characters remaining.'
}
