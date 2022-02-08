import { registerCriteriaProjector } from '../../subprojectors/criteriaProjector.js'

export { setupCriteria }

/**
 * Grabs a criteria element from regsiterCriteriaProjector for each pattern and appends them into a container element
 * @param {object} register - Holds all attributes of the register model
 * @param {HTMLElement} rootElement
 * @returns {HTMLElement} - Container containing all criteria elements
 */
const setupCriteria = (register, rootElement) => {

  const patterns = register.getPatterns()
  const criteriaElements = patterns.map(pattern => registerCriteriaProjector(register, pattern.name))

  // Div Element which already exists in index.html
  const criteriaContainer = rootElement.querySelector('.pw-criteria')
  criteriaElements.forEach(element => criteriaContainer.appendChild(element))

  return criteriaContainer
}