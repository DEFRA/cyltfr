const commentMap = window.LTFMGMT.commentMap
const geometry = window.LTFMGMT.geometry
const capabilities = window.LTFMGMT.capabilities

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
