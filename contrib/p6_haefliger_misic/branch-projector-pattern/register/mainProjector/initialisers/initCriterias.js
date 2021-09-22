import { registerCriteriaProjector } from '../../subprojectors/criteriaProjector.js'

export { initCriterias }

const initCriterias = (register, rootElement) => {

  const patterns = register.getPatterns().slice(0, -1)  // Removing the 8 Chars criteria, since we dont want it to be displayed on the UI. (Not using pop() because it mutates the patterns array)
  const criteriaElements = patterns.map(pattern => registerCriteriaProjector(register, pattern.name))

  const criteriaContainer = rootElement.querySelector('.pw-criterias')
  criteriaElements.forEach(element => criteriaContainer.appendChild(element))

  return criteriaContainer
}