const commentMap = window.LTFMGMT.commentMap
const geometry = window.LTFMGMT.geometry
const capabilities = window.LTFMGMT.capabilities

console.log(commentMap)

geometry.features.forEach(function (feature, index) {
  const geo = Object.assign({}, geometry, {
    features: geometry.features.filter(function (f) {
      return f === feature
    })
  })

  commentMap(geo, 'map_' + index, capabilities)
})

const textareas = document.querySelectorAll('textarea')
const remainingCharsTexts = document.querySelectorAll('.remaining-chars-text')
const maxLengths = Array.from(textareas).map(textarea => parseInt(textarea.getAttribute('maxLength')))
// const overrideRadio = document.getElementById('map_0-override')

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




// const textareaWidget = function (props) {
//   const [charsLeft, setCharsLeft] = useState(Math.max(0, props.schema.maxLength - props.value.length))
//   const p = {
//     rows: 5,
//     id: props.id,
//     value: props.value,
//     required: props.required,
//     maxLength: props.schema.maxLength,
//     className: 'govuk-textarea',
//     onChange: function (event) {
//       const value = event.target.value
//       setCharsLeft(props.schema.maxLength - value.length)
//       props.onChange(value)
//     }
//   }

//   return React.createElement('div', null, [
//     React.createElement('textarea', p),
//     React.createElement('p', {
//       className: 'govuk-hint govuk-character-count__message'
//     }, ['You have ', charsLeft, ' characters remaining'])
//   ])
// }
