import { toggleColor } from '../utils/toggleColor.js'

export { registerCriteriaProjector }

const registerCriteriaProjector = (register, label) => {

  const pElement    = document.createElement('p')
  const spanElement = document.createElement('span')

  spanElement.classList.add('cross')

  pElement.appendChild(spanElement)
  pElement.innerHTML = `
    <span></span>
    ${label}
  `
  pElement.querySelector('span').replaceWith(spanElement)

  register.onPatternsChanged( patterns => {

    const thisPattern = patterns.filter(pattern => pattern.name === label)[0]

    if(!register.getPassword()) return toggleColor(pElement, null) // Password field is empty, reset all colors

    // Set color according to the fulfilled status
    toggleColor(pElement, thisPattern.isFulfilled) 
  })

  return pElement
}