function scenarioDisplayUpdate (scenarioBar) {
  const scenariosRadios = document.querySelectorAll(`input[name="scenarios-${scenarioBar}"]`)
  scenariosRadios.forEach(radio => {
    if (radio.checked) {
      const parent = radio.parentNode
      parent.style.borderBottom = '7px solid rgb(29, 112, 184)'
      const scenarioHeading = parent.querySelector('.scenario-heading')
      scenarioHeading.style.textDecoration = 'none'
    } else {
      const parent = radio.parentNode
      parent.style.borderBottom = 'none'
      const scenarioHeading = parent.querySelector('.scenario-heading')
      scenarioHeading.style.textDecoration = 'underline'
      scenarioHeading.style.textDecorationThickness = '2px'
    }
  })
}

function handleScroll (scenarioBar, arrows) {
  scenarioBar.addEventListener('scroll', function () {
    const currentScrollPosition = scenarioBar.scrollLeft
    const divWidth = scenarioBar.offsetWidth
    const scrollWidth = scenarioBar.scrollWidth

    arrows[0].classList.toggle('hide', currentScrollPosition === scrollWidth - divWidth)
    arrows[1].classList.toggle('hide', currentScrollPosition === 0)
  })
}

module.exports = {
  scenarioDisplayUpdate,
  handleScroll
}
