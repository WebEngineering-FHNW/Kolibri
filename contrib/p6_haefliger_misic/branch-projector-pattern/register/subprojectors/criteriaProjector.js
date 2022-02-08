import { toggleColor } from '../utils/toggleColor.js'
import { toggleIconClass } from "../utils/toggleIconClass.js";

export { registerCriteriaProjector }

/**
 * Generates a paragraph element that represent one criteria and binds attributes and icons to it.
 * @param {object} register - Holds all attributes of the register model
 * @param {string} label - Describes the name of the pattern (e.g. uppercase)
 * @returns {HTMLElement}
 */
const registerCriteriaProjector = (register, label) => {

  const pElement    = document.createElement('p')
  const divElement = document.createElement('div')

  pElement.classList.add(label.replace(/ /g, '')) // Remove whitespaces to add class 
  divElement.classList.add('cross-default')

  pElement.appendChild(divElement)
  pElement.innerHTML = `
    <div></div>
    ${label}
  `
  pElement.querySelector('div').replaceWith(divElement)

  register.onPatternsChanged( patterns => {

    const thisPattern = patterns.filter(pattern => pattern.name === label)[0]

    if(!register.getPassword()) { // If Password field is empty, reset all colors and icons
      toggleColor(pElement, null)
      toggleIconClass(divElement, null)
      return
    }

    // Set color according to the fulfilled status
    toggleColor(pElement, thisPattern.isFulfilled)
    toggleIconClass(divElement, thisPattern.isFulfilled)
  })

  return pElement
}